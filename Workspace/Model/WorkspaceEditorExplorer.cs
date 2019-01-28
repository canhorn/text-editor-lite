using EventHorizon.CodeEditorLite.Editor.Model;

namespace EventHorizon.CodeEditorLite.Workspace.Model
{
    public struct WorkspaceEditorExplorer
    {
        public string Workspace { get; set; }
        public EditorFolder Root { get; set; }
    }
}