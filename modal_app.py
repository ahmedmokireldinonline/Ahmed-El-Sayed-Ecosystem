"""Optional serverless API for the Ahmed El Sayed platform.

The public Vite frontend is deployed on Vercel. Modal is used only for
serverless Python endpoints that may be added behind the frontend later.
"""

import modal

app = modal.App("ahmed-el-sayed-platform-api")

image = modal.Image.debian_slim(python_version="3.11")


@app.function(image=image)
@modal.fastapi_endpoint(method="GET")
def health() -> dict[str, str]:
    """Return a lightweight deployment health response."""
    return {"status": "ok", "service": "ahmed-el-sayed-platform-api"}
