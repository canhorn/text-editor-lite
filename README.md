# What is Code Editor Lite

Code Editor Lite is a simple website with the added ability to manage a workspace of folder and files. The workspace is hosted in the container and can be explored from the browser. The website has simple commands; Add File, Add Folder, and Delete a file or folder. It has a CLI/Terminal service to send commands from the webpage to the container.

# How to use this image

## Start instance

```
$ docker run --name my-code-editor -p 5000:80 -d canhorn/text-editor-lite
```

Creates a container exposed on the hosts port 5000, by the name of `my-code-editor`.

Visit http://localhost:5000 to see it in action.

## Start instance with persistence

```
$ docker run -v /app/App_Data:/app/App_Data -p 5000:80 -d canhorn/text-editor-lite
```

# How to use Code Editor Lite

The Workspace page contains a list of available `workspace` folders located in the Container. On the Workspace page a new unique workspace can be created, and old can be deleted. A deleted workspace will be moved into the folder, `/app/App_Data/.deleted.Workspaces`, This is done to allow for accidental deletes.

Clicking on a Workspace will navigate to the Editor/Terminal of the workspace. The **Workspace Dashboard** starts in the **Editor**, which is a file explorer of the workspace and allows for the creation, delete, and edit of files and folders. 

Right clicking on a folder or file in the Explorer will come up with Add File, Add Folder, and Delete. Choosing any option from the context menu will prompt for a name for the folder/file or verification of delete of the file/folder. Left-clicking on a folder will expand the folder, right-clicking on a folder will load its content and allow for edits. 

The **Editor** will save on five (5) second intervals, or moving to a new area and not saved will prompt to save.

Opening the **Terminal** tab will show a Command Prompt to send commands to the Server in the context of the workspace.

> **A Warning:** The Terminal has root access to the container.
