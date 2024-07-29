import requests

def get_next_match_sharing_code(api_key, steam_id, steamid_key, known_code):
    url = "https://api.steampowered.com/ICSGOPlayers_730/GetNextMatchSharingCode/v1"
    params = {
        'key': api_key,
        'steamid': steam_id,
        'steamidkey': steamid_key,
        'knowncode': known_code
    }
    print(url, params)
    response = requests.get(url)
    if response.status_code == 200:
        # Next match sharing code is available
        data = response.json()
        return data['result']['nextcode']
    elif response.status_code == 202:
        # No next match available
        return "No further matches available."
    elif response.status_code == 403:
        return "Forbidden:"
    elif response.status_code == 429 or response.status_code == 503:
        return "Rate limit exceeded or service unavailable. Please retry later."
    elif response.status_code == 412:
        return "Precondition Failed: Known code is invalid."
    elif response.status_code == 500:
        return "Internal Server Error: The server encountered an error."
    elif response.status_code == 504:
        return "Gateway Timeout: The request timed out."
    else:
        return f"Error: {response.status_code} - {response.text}"


# # Fetch the next match sharing code
# next_match_code = get_next_match_sharing_code(api_key, steam_id, steamid_key, known_code)
# print(next_match_code)


def get_player_summaries(api_key, steam_id):
    url = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/"
    params = {
        'key': api_key,
        'steamids': steam_id  # Note that this parameter is 'steamids' and can accept multiple IDs
    }
    
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        return data['response']['players']
    else:
        return f"Error: {response.status_code} - {response.text}"

# Test the function
player_data = get_player_summaries(api_key, steam_id)
print(player_data)