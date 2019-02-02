using System.IO;
using System.Text.RegularExpressions;

namespace EventHorizon.CodeEditorLite.Workspace.Create
{
    public static class PathValidator
    {
        private static Regex INVALID_FILE_NAME_REGEX = new Regex($"[{Regex.Escape(new string(Path.GetInvalidFileNameChars()))}]");
        private static Regex INVALID_PATH_REGEX = new Regex($"[{Regex.Escape(new string(Path.GetInvalidPathChars()))}]");
        public static bool IsValidPathAndFolder(string path, string folderName)
        {
            if (INVALID_PATH_REGEX.IsMatch(path)
                || INVALID_FILE_NAME_REGEX.IsMatch(folderName))
            {
                return false;
            };
            return true;
        }
    }
}