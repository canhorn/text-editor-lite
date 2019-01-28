namespace EventHorizon.CodeEditorLite.Editor.Model
{
    public struct EditorFolder
    {
        public string Name { get; set; }
        public EditorFolder[] FolderList { get; set; }
        public string[] FileNameList { get; set; }
    }
}