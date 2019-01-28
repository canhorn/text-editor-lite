using EventHorizon.CodeEditorLite.Hubs;
using Microsoft.AspNetCore.Builder;

namespace EventHorizon.CodeEditorLite
{
    public static class HubsExtensions
    {
        public static IApplicationBuilder UseHubs(this IApplicationBuilder app)
        {
            return app.UseSignalR(routes =>
            {
                routes.MapHub<EditorHub>("/hub/editor");
                routes.MapHub<TerminalHub>("/hub/terminal");
                routes.MapHub<WorkspaceHub>("/hub/workspace");
            });
        }
    }
}