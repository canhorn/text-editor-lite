using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Threading.Tasks;

public static class ProcessExtensions
{
    public static async Task<string> RunCLICommand(this string cmd, string workingDirectory)
    {
        try
        {
            var escapedArgs = cmd.Replace("\"", "\\\"");

            var isWindows = RuntimeInformation
                .IsOSPlatform(OSPlatform.Windows);
            var fileName = "/bin/bash";
            var arguments = $"-c \"{escapedArgs}\"";
            if (isWindows)
            {
                fileName = "powershell.exe";
                arguments = $"/C \"{escapedArgs}\"";
            }

            using (var process = new Process()
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = fileName,
                    Arguments = arguments,
                    WorkingDirectory = workingDirectory,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true,
                }
            })
            {
                process.Start();
                var error = await process.StandardError.ReadToEndAsync();
                if (!string.IsNullOrEmpty(error))
                {
                    return error;
                }
                return process.StandardOutput.ReadToEnd();
            }
        }
        catch (Exception ex)
        {
            return ex.Message;
        }
    }
}