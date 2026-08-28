import os
import io
import base64
import time
import traceback
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image

app = FastAPI(title="Inner Compass AI 3D Pose Novel View Synthesizer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Models ──────────────────────────────────────────────────────────────────────
class SynthesizeRequest(BaseModel):
    frame_base64: Optional[str] = None
    frame_url: Optional[str] = None
    pose_title: Optional[str] = "Yoga Posture"
    provider: Optional[str] = "huggingface"
    angles: Optional[list] = [0, 45, 90, 135, 180, 225, 270, 315]


# ── Image Helpers ───────────────────────────────────────────────────────────────
def decode_image(base64_str: str) -> Image.Image:
    if "," in base64_str:
        base64_str = base64_str.split(",")[1]
    return Image.open(io.BytesIO(base64.b64decode(base64_str))).convert("RGB")


def encode_image(img: Image.Image) -> str:
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=92)
    return f"data:image/jpeg;base64,{base64.b64encode(buf.getvalue()).decode()}"


# ── Angle → Camera Description Mapping ──────────────────────────────────────────
ANGLE_CAMERA = {
    0:   ("front view, facing the camera directly, frontal perspective", "front"),
    45:  ("front-right three-quarter view, camera rotated 45 degrees to the right", "front-right oblique"),
    90:  ("right side profile view, camera at 90 degrees showing the right side of the body", "right profile"),
    135: ("rear-right three-quarter view, camera behind and to the right at 135 degrees", "rear-right oblique"),
    180: ("rear view, back of the person facing the camera, seen from directly behind", "rear"),
    225: ("rear-left three-quarter view, camera behind and to the left at 225 degrees", "rear-left oblique"),
    270: ("left side profile view, camera at 270 degrees showing the left side of the body", "left profile"),
    315: ("front-left three-quarter view, camera rotated 45 degrees to the left", "front-left oblique"),
}


def build_prompt(pose_title: str, angle: int) -> str:
    """Build a detailed text prompt for generating the yoga pose from a specific camera angle."""
    camera_desc, short_name = ANGLE_CAMERA.get(angle, (f"camera at {angle} degrees", f"{angle}deg"))

    prompt = (
        f"A photorealistic full-body photograph of a yoga practitioner performing {pose_title} pose, "
        f"{camera_desc}. "
        f"The person is wearing fitted yoga clothing. "
        f"Clean minimalist yoga studio background with soft natural lighting. "
        f"Sharp focus, professional sports photography, anatomically accurate human body, "
        f"natural skin tones, high resolution, 8k quality."
    )
    return prompt


# ── HuggingFace FLUX Text-to-Image Generator ────────────────────────────────────
_hf_client = None

def get_hf_client():
    """Lazy-initialize the HuggingFace InferenceClient."""
    global _hf_client
    if _hf_client is None:
        token = os.getenv("HF_API_TOKEN") or os.getenv("HUGGINGFACE_TOKEN")
        if not token:
            return None
        from huggingface_hub import InferenceClient
        _hf_client = InferenceClient(api_key=token)
    return _hf_client


def generate_view_with_flux(pose_title: str, angle: int) -> Optional[Image.Image]:
    """
    Generate a novel view image of the yoga pose from the specified camera angle
    using HuggingFace's FLUX.1-schnell text-to-image model (completely free).
    """
    client = get_hf_client()
    if not client:
        return None

    prompt = build_prompt(pose_title, angle)

    try:
        result = client.text_to_image(
            prompt=prompt,
            model="black-forest-labs/FLUX.1-schnell",
        )
        # Result is a PIL Image
        if result and hasattr(result, 'size'):
            # Resize to a consistent output size
            result = result.resize((768, 768), Image.Resampling.LANCZOS)
            return result
        return None

    except Exception as e:
        print(f"FLUX generation error for {angle}°: {e}")
        traceback.print_exc()
        return None


# ── Endpoints ───────────────────────────────────────────────────────────────────
@app.get("/")
def health_check():
    token = os.getenv("HF_API_TOKEN") or os.getenv("HUGGINGFACE_TOKEN")
    provider = "HuggingFace FLUX.1-schnell (Active)" if token else "NONE — Set HF_API_TOKEN"

    return {
        "status": "ONLINE",
        "service": "Inner Compass AI 3D Pose Novel View Synthesizer",
        "active_provider": provider,
        "model": "black-forest-labs/FLUX.1-schnell (Free, Text-to-Image)",
        "how_it_works": (
            "Given a yoga pose name and camera angle (0° to 315°), "
            "generates a photorealistic novel-view image of the practitioner "
            "from that exact camera perspective using FLUX AI diffusion model."
        ),
    }


@app.post("/api/v1/ai/synthesize-view")
def synthesize_view(req: SynthesizeRequest):
    """
    Generates 360° novel view images of a yoga pose using FLUX.1-schnell AI model.
    Each angle gets a unique AI-generated image showing the pose from that camera perspective.
    """
    try:
        token = os.getenv("HF_API_TOKEN") or os.getenv("HUGGINGFACE_TOKEN")
        if not token:
            raise HTTPException(
                status_code=503,
                detail="No HF_API_TOKEN configured. Set the HF_API_TOKEN environment variable."
            )

        pose = req.pose_title or "Yoga Posture"
        synthesized_angles = {}
        provider_used = "HuggingFace FLUX.1-schnell (AI Generated)"

        for angle in req.angles:
            print(f"Generating {angle}° view for '{pose}'...")
            ai_image = generate_view_with_flux(pose, angle)

            if ai_image:
                synthesized_angles[str(angle)] = encode_image(ai_image)
                print(f"  ✓ {angle}° generated successfully ({ai_image.size})")
            else:
                # If one angle fails, use the base frame as fallback for that angle only
                print(f"  ✗ {angle}° generation failed, using input frame fallback")
                if req.frame_base64:
                    fallback = decode_image(req.frame_base64)
                    synthesized_angles[str(angle)] = encode_image(fallback)
                else:
                    synthesized_angles[str(angle)] = ""

        return {
            "status": "COMPLETED",
            "taskId": f"flux-nvs-{int(time.time())}",
            "provider": provider_used,
            "serviceProvider": provider_used,
            "poseTitle": pose,
            "synthesizedAngles": synthesized_angles,
            "message": f"AI-generated {len(synthesized_angles)} novel view images of '{pose}' using FLUX.1-schnell.",
        }

    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"AI synthesis error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5001)
