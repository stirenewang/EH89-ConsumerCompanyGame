from flask import Flask, render_template

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

@app.route('/gameover_consumer')
def gameover_consumer():
	return render_template('gameover_consumer.html')

@app.route('/gameover_consumer2')
def gameover_consumer2():
	return render_template('gameover_consumer2.html')

@app.route('/gameover_company')
def gameover_company():
	return render_template('gameover_company.html')

@app.route('/gameover_company2')
def gameover_company2():
	return render_template('gameover_company2.html')

@app.route('/company2')
def company2():
	return render_template('company2.html')

@app.route('/consumer2')
def consumer2():
	return render_template('consumer2.html')

if __name__ == '__main__':
	app.run()