from flask import Flask, render_template
import os

app = Flask(__name__)

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
	app.run()