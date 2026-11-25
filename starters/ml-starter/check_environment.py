"""Check this computer for the ML starter. Run it with: uv run check_environment.py"""

import importlib.metadata
import subprocess
import sys


def first_line(*command):
    """The first line a command prints, or None if it cannot run."""
    try:
        done = subprocess.run(command, capture_output=True, text=True, check=True)
    except (OSError, subprocess.CalledProcessError):
        return None
    return done.stdout.strip().split("\n")[0] or None


def installed(package):
    """The installed version of a package, or None."""
    try:
        return importlib.metadata.version(package)
    except importlib.metadata.PackageNotFoundError:
        return None


version = ".".join(str(part) for part in sys.version_info[:3])
named = first_line("git", "config", "user.name") and first_line("git", "config", "user.email")
checks = [
    ("Python 3.12 or newer", version if sys.version_info >= (3, 12) else None, "uv run --python 3.13 check_environment.py"),
    ("Git", first_line("git", "--version"), "install Git, then open a new terminal"),
    ("Git name and email", "set" if named else None, 'git config --global user.name "Your Name" (and user.email)'),
    ("uv", first_line("uv", "--version"), "install uv, then open a new terminal"),
    ("scikit-learn", installed("scikit-learn"), "run: uv sync"),
    ("pandas", installed("pandas"), "run: uv sync"),
    ("pytest", installed("pytest"), "run: uv sync"),
]
passed = 0
for label, found, fix in checks:
    if found:
        passed += 1
        print(f"PASS  {label}: {found}")
    else:
        print(f"FAIL  {label}\n      Fix: {fix}")
print(f"{passed} of {len(checks)} checks passed.")
sys.exit(0 if passed == len(checks) else 1)
