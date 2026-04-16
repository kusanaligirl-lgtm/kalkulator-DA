import http.server
import socketserver
import webbrowser
from threading import Timer

PORT = 8000

class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        # Mute simple HTTP requests log for cleaner console output
        pass

def open_browser():
    webbrowser.open_new(f"http://localhost:{PORT}")

def run_server():
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print("="*50)
        print("✨ Server Antigravity - Kalkulator Deret Aritmatika ✨")
        print("="*50)
        print(f"🚀 Server berjalan di http://localhost:{PORT}")
        print("💡 Tekan Ctrl+C di terminal ini untuk mematikan server.")
        
        # Open browser automatically after 1 second
        Timer(1, open_browser).start()
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n⛔ Server dimatikan.")

if __name__ == "__main__":
    run_server()
