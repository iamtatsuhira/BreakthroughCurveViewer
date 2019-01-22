from flask import Flask, render_template, url_for, request, redirect, make_response, jsonify
import numpy as np
import plotly
import plotly.graph_objs as go
import json
import os
import io

from breakthroughdata import BreakthroughData

ALLOWED_EXTENSIONS = set(['txt', 'dat'])

app = Flask(__name__, static_folder="public/static", template_folder="public")
breakthrough_data = BreakthroughData()

@app.route("/")
def index():
    return render_template('index.html')


def allowed_file(filename):
    '''
    扱うファイルが*.txtもしくは*.dat（ALLOWED_EXTENSIONSにある拡張子のファイル）ならTrueを返す
    Arguments:
        filename {str} -- 対象となるファイル名
    
    Returns:
        boolean -- ALLOWED_EXTENSIONSにある拡張子のファイルならTrue，それ以外ならFalse
    '''
    # eg. filemane = 'hoge.txt'
    # eg. '.' in filename -> True
    # eg. filename.rsplit('.', 1) -> ['hoge', 'txt']
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

@app.route("/add-data", methods=["POST"])
def add_data():
    keys = []
    for key in request.files:
        keys.append(key)
    add_num = 0
    for key in keys:
        file = request.files[key]
        if file and allowed_file(file.filename):
            data_dict = read_data_from(file)

            # add datum to breakthrough_data
            breakthrough_data.add_data(**data_dict)
            add_num += 1

    # make json for plotly
    response = breakthrough_data.get_json_both_time_pos(add_num)
    response = jsonify(response)

    return response

def read_data_from(file):
    file_name = file.filename

    # read data as numpy array
    data_temp = io.TextIOWrapper(file.stream._file)

    first_row_data = data_temp.readline().strip().split()
    space_array = np.array(first_row_data[1:], float)
    grid_in_space = space_array.shape[0]

    rest_data = data_temp.read().strip().split()
    time_array = np.array(rest_data, float).reshape(-1, grid_in_space+1)[:,0]
    grid_in_time = time_array.shape[0]

    main_array = np.array(rest_data, float).reshape(-1, grid_in_space+1)[:,1:]

    return_dictionary = {
        "file_name": file_name,
        "space_array": space_array,
        "time_array": time_array,
        "main_array": main_array
    }
    return return_dictionary

@app.route("/get-plot-data", methods=["POST"])
def send_plot_data():
    # make json for plotly
    response = breakthrough_data.get_json_both_time_pos()
    response = jsonify(response)

    return response

@app.route("/remove-datum", methods=["POST"])
def remove_datum():
    data_id = int(request.data)
    breakthrough_data.remove_datum(data_id)
    response = breakthrough_data.get_json_both_time_pos()
    response = jsonify(response)

    return response

@app.route("/get-is-data-empty", methods=["GET"])
def return_is_data_empty():
    is_data_empty = breakthrough_data.check_is_data_empty()
    response = jsonify(is_data_empty)
    return response

@app.route("/remove-all-data", methods=["POST"])
def remove_all_data():
    breakthrough_data.remove_all_data()
    response = breakthrough_data.get_json_both_time_pos()
    response = jsonify(response)

    return response

if __name__ == "__main__":
    app.run(debug=True)