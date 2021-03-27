from urllib import parse
from http.server import BaseHTTPRequestHandler
import sys
from io import StringIO
from black import format_str, FileMode
import json

class handler(BaseHTTPRequestHandler):

    def do_POST(self):
        code = ''
        try:
            content = self.rfile.read(int(self.headers.get('Content-Length')))
            code = json.loads(content)['code']
        except:
            self.send_response(400)
            self.send_header('Content-type','text/plain')
            self.end_headers()
            self.wfile.write("'code' query parameter expected".encode())
            return

        if 'import' in code:
            self.send_response(400)
            self.send_header('Content-type','text/plain')
            self.end_headers()
            self.wfile.write("import is not allowed yet".encode())
            return

        try:
            out = format_str(code, mode=FileMode())
            self.send_response(200)
            self.send_header('Content-type','text/plain')
            self.end_headers()
            self.wfile.write(out.encode())
        except Exception as e:
            self.send_response(200)
            self.send_header('Content-type','text/plain')
            self.end_headers()
            self.wfile.write(str(e).encode())
