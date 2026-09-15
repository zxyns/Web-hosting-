# ZXYN Hosting

Railway-ready Flask control panel starter with registration, login, multi-user hosting records, create-hosting form, status controls, and per-host file upload.

Deploy from GitHub to Railway. Add a strong `SECRET_KEY` environment variable.

IMPORTANT: this starter does not execute uploaded customer code or expose a Docker daemon. For real hosting, connect the control plane to a separately secured worker/node with sandboxing, resource limits, storage quotas, authentication and abuse controls.