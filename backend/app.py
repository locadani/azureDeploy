from flask import Flask, render_template, send_from_directory
import os
import sys

build_folder = 'static'

if getattr(sys, 'frozen', False):    
    template_dir = os.path.join(sys._MEIPASS, build_folder)
else:    
    ROOT_PATH = os.path.abspath(os.path.dirname(__file__))    
    template_dir = os.path.join(ROOT_PATH, build_folder)
 

app = Flask(__name__, static_folder=os.path.join(template_dir, 'assets'), template_folder=template_dir)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/<path:path>')
def catch_all(path):
    return render_template('index.html')

if __name__ == '__main__':
   app.run()
