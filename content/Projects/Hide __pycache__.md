Don't want `__pyache__` directories in your project? And is ignoring it inside your IDE or using .gitignore not enough? You can also store the cache files in a central directory as follows.

### Step 1: Create the Central Cache Directory

Run this command to create a dedicated folder for your bytecode inside your user cache. The `-p` flag ensures it creates the folder safely if it doesn't already exist.

Bash

```
mkdir -p ~/.cache/pycache
```

### Step 2: Append the Variable to Your Config

Instead of opening a text editor, you can use `echo` to cleanly append the export rule to the bottom of your `.bashrc` file:

Bash

```
echo 'export PYTHONPYCACHEPREFIX="$HOME/.cache/pycache"' >> ~/.bashrc
```

### Step 3: Reload Your Shell

To apply the changes to your current terminal window immediately (without closing it or logging out), source the file:

Bash

```
source ~/.bashrc
```

---

### Step 4: Verify the Setup

To confirm that everything is wired up correctly, ask your system to print the variable:

Bash

```
echo $PYTHONPYCACHEPREFIX
```

If it returns `/home/yourusername/.cache/pycache`, you are all set. Python will now automatically mirror your project paths inside that directory and leave your actual project workspaces pristine.