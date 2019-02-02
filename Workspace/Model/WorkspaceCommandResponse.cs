namespace EventHorizon.CodeEditorLite.Workspace.Model
{
    public struct WorkspaceCommandResponse
    {
        public bool Success { get; }
        public string ErrorCode { get; }
        public WorkspaceCommandResponse(bool success)
        {
            this.Success = success;
            this.ErrorCode = "";
        }
        public WorkspaceCommandResponse(string errorCode)
        {
            this.Success = false;
            this.ErrorCode = errorCode;
        }

    }
}