import sys
import yaml
import pandas as pd

input_file = sys.argv[1]
output_path = sys.argv[2]
subteam = sys.argv[3]
current_year = int(sys.argv[4])

df = pd.read_csv(input_file)

# set first row as header
df.columns = [x if i != 0 else "Name" for i, x in enumerate(df.iloc[0])]
df = df[1:]

def normalize_name(name):
    if '-' in name:
        return name.strip().replace(" ", "--").replace("'", "").lower()
    return name.strip().replace(" ", "-").replace("'", "").lower()

# print name if On Deliverables? is true
for index, row in df.iterrows():
    if str(row['On Deliverables?']).strip().lower() == 'true':
        name = row['Name'].strip()
        print(name)
        yaml_file_name = f"{output_path}/{normalize_name(name)}.yaml"

        # check if yaml file exists
        try:
            with open(yaml_file_name, 'r') as f:
                data = yaml.safe_load(f)
        except FileNotFoundError:
            data = {}
        
        if 'name' not in data:
            data['name'] = name
        
        if 'roles' not in data:
            data['roles'] = []
        
        if 'subteams' not in data:
            data['subteams'] = []

        subteam_id = subteam.lower()

        if not any(st['id'] == subteam_id for st in data['subteams']):
            data['subteams'].append({
                'id': subteam_id,
                'years': [current_year]
            })
        else:
            for st in data['subteams']:
                if st['id'] == subteam_id and current_year not in st['years']:
                    st['years'].append(current_year)

        with open(yaml_file_name, 'w') as f:
            yaml.dump(data, f)
