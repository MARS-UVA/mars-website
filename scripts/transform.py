import yaml
import glob
import os

# """
# convert this format:
# name: Michael Chesterman
# professionalPicture: /images/people/2025/2025/formal/Michael Chesterman.jpg
# profilePicture: /images/people/2025/2025/Michael Chesterman.jpg
# roles:
#   - name: Outreach Chair
#     subteam: exec
#     years:
#       - 2025
#       - 2026
# subteams:
#   - id: mechanical
#     years:
#       - 2025
#       - 2026
#   - id: exec
#     years:
#       - 2025
#       - 2026

# into this format:
# name: Zach Parsia
# defaultProfilePicture:
#   year: 2025
#   type: profile
# professionalPictures:
#   - year: 2025
#     src: /images/people/2025/2025/Zach Parsia Professional.jpg
# profilePictures:
#   - year: 2025
#     src: /images/people/2025/2025/Zach Parsia.jpg
# roles: []
# subteams:
#   - id: mechanical
#     years:
#       - 2025
#       - 2026

# """
def transform_person_yaml(input_yaml: str) -> str:
    data = yaml.safe_load(input_yaml)

    # Transform professionalPicture
    if 'professionalPicture' in data:
        data['professionalPictures'] = [{
            'year': 2025,  # Assuming year is 2025 for this example
            'src': data.pop('professionalPicture').replace('people', 'people/2025')
        }]

    # Transform profilePicture
    if 'profilePicture' in data:
        data['profilePictures'] = [{
            'year': 2025,  # Assuming year is 2025 for this example
            'src': data.pop('profilePicture').replace('people', 'people/2025')
        }]

    # Set defaultProfilePicture
    if 'profilePictures' in data:
        data['defaultProfilePicture'] = {
            'year': data['profilePictures'][0]['year'],
            'type': 'profile'
        }
    elif 'professionalPictures' in data:
        data['defaultProfilePicture'] = {
            'year': data['professionalPictures'][0]['year'],
            'type': 'professional'
        }

    output_yaml = yaml.dump(data, sort_keys=False)
    return output_yaml

def add_new_professional_pictures(input_yaml: str) -> str:
    data = yaml.safe_load(input_yaml)

    # Add new professional picture for 2025 if not already present
    if 'professionalPictures' not in data:
        data['professionalPictures'] = []

    src = f"/images/people/2026/formal/{data['name']}.jpg"

    if not os.path.exists(f"public{src}"):
        return None

    years_present = {pic['year'] for pic in data['professionalPictures']}
    if 2026 not in years_present:
        data['professionalPictures'].append({
            'year': 2026,
            'src': src
        })

    output_yaml = yaml.dump(data, sort_keys=False)
    return output_yaml

for filepath in glob.glob('src/content/people/*.yaml'):
    with open(filepath, 'r') as file:
        input_yaml = file.read()

    output_yaml = transform_person_yaml(input_yaml)
    if output_yaml is None:
        continue

    with open(filepath, 'w') as file:
        file.write(output_yaml)

    output_yaml = add_new_professional_pictures(output_yaml)
    if output_yaml is None:
        continue

    with open(filepath, 'w') as file:
        file.write(output_yaml)
