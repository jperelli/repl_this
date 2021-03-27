from urllib import parse
from http.server import BaseHTTPRequestHandler
import sys
from io import StringIO
import json
import IPython

def run(code):
    oldout = sys.stdout
    olderr = sys.stderr
    auxout = StringIO()
    auxerr = StringIO()
    sys.stdout = auxout
    sys.stderr = auxerr
    pluserr = ''
    try:
        # TODO: this try except does not work. All serverless function explodes here if code is invalid :S
        IPython.start_ipython(argv=["--simple-prompt","--init","-c", r"%reset -f" + "\n" + code], user_ns={})
        # exec(code, {}, {})
    except Exception as e:
        pluserr = str(e)
    out = auxout.getvalue()
    err = auxerr.getvalue() # + pluserr
    sys.stdout = oldout
    sys.stderr = olderr
    return out, err

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

        unquoted_code = parse.unquote(code)
        if 'import' in unquoted_code:
            self.send_response(400)
            self.send_header('Content-type','text/plain')
            self.end_headers()
            self.wfile.write("import is not allowed yet".encode())
            return

        out, err = run(unquoted_code)
        self.send_response(200)
        self.send_header('Content-type','text/plain')
        self.end_headers()
        self.wfile.write(out.encode())
