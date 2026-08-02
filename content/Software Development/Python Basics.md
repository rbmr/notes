### Dependency Management

A python project is likely to rely on external dependencies. To manage these dependencies properly, it is recommended to use a dependency manager. 

Many dependency managers exist, and which is ideal is subject to debate. As of July 2026, we recommend using **uv**.

Install uv here: [https://docs.astral.sh/uv/#installation](https://docs.astral.sh/uv/#installation)

We recommend using in-project virtual environments, that is, you store the virtual environment in a `.venv` folder in the project root. This ensures IDEs can reliably automatically detect your virtual environments, and the virtual environment is cleaned up when the project is deleted. uv automatically creates and uses in-project virtual environments by default. 

You can set up uv in a python project using `uv init`.

Dependency Management:
- Adding dependencies: `uv add <package>`
- Removing dependencies: `uv remove <package>`
- Updating dependencies: `uv lock --upgrade-package <package>` for a specific package, `uv lock --upgrade` for all packages.
- Creating the virtual environment and installing dependencies: `uv sync`

Running code:
- Run a single command using the venv: `uv run <command>`

### Code style

We use automated tools to enforce code style. 

We use `ruff` for linting, code formatting, and import sorting. It replaces the need for separate tools like `black`, `isort`, and `pydocstyle`, and is significantly faster.

Commands:
- Install using: `uv add ruff --dev`
- Format your code: `uv run ruff format`
- Fail if code is not properly formatted: `uv run ruff format --check`
- Lint and fix issues: `uv run ruff check --fix`
- Fail if checker encounters issues  `uv run ruff check`

Code style should be enforced before every commit.

### Type Hinting

(TODO: state that python uses dynamic typing, then explain type hinting as a way to document code, aswell as allow the IDE to catch errors before runtime, then state a general rule of thumb is to add just enough type hints that allow IDEs to guess types of all variables. Specifically, ensure all functions have properly typed parameters and return values.  )

### Code Organization

Simple rules for code organization are:

* **DRY: Don’t Repeat Yourself**: Avoid duplicate code. Instead of copy-pasting, or rewriting the same logic multiple times, put shared logic into reusable functions or classes. This makes the code easier to maintain and read, since changes only happen in one place.
* **FAIL-FAST**: Code should be written to report errors as early as possible. Don't hide exceptions or return `None` when an error state occurs. This makes debugging much easier because the root cause of a problem is closer to where the error is reported.
* **Low Coupling, High Cohesion**: Coupling refers to the degree of interdependence between modules, and cohesion refers to the degree to which the elements in a single module belong together. We want low coupling, high cohesion.
- **No Global Variables**: (TODO: explain why global state is bad, and what to use instead (parameters, attributes), explain why global constants are fine)

### Datetimes

(TODO: reorganize these notes to first introduce time as float seconds since epoch (introduce time library). Then explain humans naturally describe time using a date and a time, leading into the existing notes).

Use the standard `date`, `time`, and `datetime` objects from the `datetime` module. Datetimes are ambiguous without timezone information. All datetimes should be made timezone-aware. For this we use `ZoneInfo` from the standard library `zoneinfo`.

> We shall not use `pytz` for time zones, as `zoneinfo` is the modern and official standard included with python.

Example:

```python
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

# Correct, timezone-aware datetime
now = datetime.now(timezone.utc)

# Or if you want a specific timezone
ams_tz = ZoneInfo("Europe/Amsterdam")
now_ams = datetime.now(ams_tz)
```

We use UTC as much as possible, as it is the universal standard and does not have Daylight Savings Time complexity.

When converting dates, times, and time deltas to and from a string, we use the ISO 8601 standard as much as possible. ISO8601 is the standard used across all programming languages, and ensures no information is lost upon serialization.

```python
# Converts to ISO 8601 string
now_iso_format = now.isoformat()

# Parse from ISO 8601 string
now_parsed = datetime.fromisoformat(now_iso_format)
assert now == now_parsed  # True

# If you need to use a specific format you use strftime (string format time) and strptime (string parse time).
custom_format = "%d-%m-%Y %H:%M"
now_custom_format = now.strftime(custom_format)  # Ex.: '27-10-2023 10:30'
now_parsed = datetime.strptime(now_custom_format, custom_format)
# now_parsed is timezone naive: seconds, milliseconds, and timezone are lost!
assert now == now_parsed  # False!

# isoformat is preferred.
```

### Paths

File paths should not break even when the package is moved between computers or operating systems. For this we use `Path` from the standard library `pathlib`.

> Using pathlib is preferable over `os.path` because it treats file paths as objects rather than mere strings, leading to more readable types, and more readable code.

```python
from pathlib import Path

# Really bad:
# config_path = "C:\Users\JohnDoe\my_project\config\settings.toml"

# Bad:
# config_path = ".\config\settings.toml"

# Okay:
# config_path = os.path.join(os.getcwd(), 'config', 'settings.toml')

# Great:
config_path = Path.cwd() / "config" / "settings.toml"
```

### Logging

One should use named loggers from the python `logging` module to log information during the execution of a script. These loggers may then be easily configured per file or module, per logging level, or per log output method (console, file, etc).

```python
import logging

logger = logging.getLogger(__name__)

logger.debug("Some debugging information, likely only useful for the developer")
logger.info("Some general information for every user of this code")
logger.warning("Information that a user is likely to want to pay attention to")
logger.error("Information that must be paid attention to")
```

### Environment variables

We shall not store secrets in the code itself as this is highly insecure. Secrets shall be stored in a `.env` file which shall NOT be committed to GitHub. These secrets may then be loaded into the environment variables using the `load_dotenv` function from the `dotenv` library (`uv add python-dotenv`). These variables can be retrieved using `os.environ`. This way, none of the code on GitHub contains any secrets.

Insecure:

```python
# python
SECRET_API_KEY = "secret123"

make_request(SECRET_API_KEY)
```

Secure:

```
# .env
SECRET_API_KEY=secret123
```

```python
# python
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_API_KEY = os.environ["SECRET_API_KEY"]

make_request(SECRET_API_KEY)
```

### String Formatting

We use **f-strings** to put variables inside strings. They are the standard because they are clean, easy to read, and fast. Do not use `+` to join strings or the older `.format()` method.

```python
name = "Alice"
age = 30

# Bad:
msg = "User " + name + " is " + str(age) + " years old."

# Also bad:
msg = "User {} is {} years old.".format(name, age)

# Good:
msg = f"User {name} is {age} years old."
```