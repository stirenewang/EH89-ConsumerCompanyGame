from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route('/')
def selection():
	return render_template('selection.html')

@app.route('/company')
def company():
	return render_template('company.html')

@app.route('/consumer')
def consumer():
	return render_template('consumer.html')

if __name__ == '__main__':
	socketio.run(app)