import numpy as np
import plotly
import plotly.graph_objs as go
import json

class BreakthroughData():
    def __init__(self):
        self.data_time_vs_var = []
        self.data_pos_vs_var = []

    def add_data(self, file_name, space_array, time_array, main_array):

        self._add_data_time_vs_var(file_name, time_array, space_array, main_array)
        self._add_data_pos_vs_var(file_name, time_array, space_array, main_array)

    def _add_data_time_vs_var(self, filename, time_array, space_array, main_array):

        grid_in_space = space_array.shape[0]
        skipLength = int(grid_in_space / 100.0) + 1 # データ数が50~100本くらいになるように

        time_vs_var_list = []
        for i in range(0, grid_in_space, skipLength):
            plotly_obj = go.Scatter(
                x = time_array,
                y = main_array[:,i],
                mode = 'lines',
                name = str(space_array[i]),
                visible = False
            )
            time_vs_var_list.append(plotly_obj)

        self.data_time_vs_var.append(time_vs_var_list)
    
    def _add_data_pos_vs_var(self, filename, time_array, space_array, main_array):

        grid_in_time = time_array.shape[0]
        skipLength = int(grid_in_time / 100.0) + 1 # データ数が50~100本くらいになるように

        pos_vs_var_list = []
        for i in range(0, grid_in_time, skipLength):
            plotly_obj = go.Scatter(
                x = space_array,
                y = main_array[i,:],
                name = str(time_array[i]),
                mode = "lines",
                visible = False
            )
            pos_vs_var_list.append(plotly_obj)
        
        self.data_pos_vs_var.append(pos_vs_var_list)
    
    def get_json_time_vs_var(self, last_num=None):

        if last_num == None: # 全てのデータをJSON化
            use_data = self.data_time_vs_var
        else: # 例えばdata_time_vs_var配列の要素数が10で，後ろからlast_num=3つの要素（index=7,8,9）を抽出
            use_data = self.data_time_vs_var[len(self.data_time_vs_var)-last_num:] # index=10-3=7から最後（index=9）まで抽出

        json_time_vs_var = json.dumps(use_data, cls=plotly.utils.PlotlyJSONEncoder)
        return json_time_vs_var

    def get_json_pos_vs_var(self, last_num=None):

        if last_num == None: # 全てのデータをJSON化
            use_data = self.data_pos_vs_var
        else: # 例えばdata_time_vs_var配列の要素数が10で，後ろからlast_num=3つの要素（index=7,8,9）を抽出
            use_data = self.data_pos_vs_var[len(self.data_pos_vs_var)-last_num:] # index=10-3=7から最後（index=9）まで抽出

        json_pos_vs_var = json.dumps(use_data, cls=plotly.utils.PlotlyJSONEncoder)
        return json_pos_vs_var
    
    def get_json_both_time_pos(self, last_num=None):
        if last_num == None: # 全てのデータをJSON化
            use_data = [self.data_time_vs_var, self.data_pos_vs_var]
        else: # 例えばdata_time_vs_var配列の要素数が10で，後ろからlast_num=3つの要素（index=7,8,9）を抽出
            use_data_time = self.data_time_vs_var[len(self.data_time_vs_var)-last_num:] # index=10-3=7から最後（index=9）まで抽出
            use_data_pos = self.data_pos_vs_var[len(self.data_pos_vs_var)-last_num:] # index=10-3=7から最後（index=9）まで抽出
            use_data = [use_data_time, use_data_pos]

        json_time_vs_var = json.dumps(use_data, cls=plotly.utils.PlotlyJSONEncoder)
        return json_time_vs_var
    
    def remove_datum(self, data_index):
        self.data_time_vs_var.pop(data_index)
        self.data_pos_vs_var.pop(data_index)

    def check_is_data_empty(self):
        is_data_empty = False
        if len(self.data_pos_vs_var) == 0:
            is_data_empty = True
        else:
            is_data_empty = False
        return is_data_empty
            
    