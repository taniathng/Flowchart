When running the backend on a new device:
1. "python -m venv <env_name>"
    To create a new python virtual environment.
2. Windows: "<env_name>\Scripts\activate" ; MAC/Linux: "source <env_name>/bin/activate"
    To activate the virtual environment
3. "pip install -r requirements.txt"
    To install new packages into the virtual environment

Do not push the python packages into github

To Deactivate Virtual Environment: "deactivate"
To Activate Virtual Environment: see Step 2 above
After installing new packages: "pip freeze > requirements.txt"
Remove Virtual Environment: "rm -rf <env_name>"
