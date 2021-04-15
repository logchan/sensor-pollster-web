namespace SensorPollsterWebServer.Model.Api.User {
    public sealed class AuthResponse {
        public bool Authenticated { get; set; }
        public string Url { get; set; }

        public AuthResponse(bool authenticated, string url) {
            Authenticated = authenticated;
            Url = url;
        }
    }
}
