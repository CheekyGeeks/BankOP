# BankOP
UPI for PC
//
#Convert Cpp File to .Exe file
g++ -o SecurityCheck.exe your_file.cpp -lws2_32 -liphlpapi
//
#Add this in views.py file might work as api function
def system_info(request):
    # Run C++ program and get JSON output
    result = subprocess.run(["./system_info"], capture_output=True, text=True)
    json_data = json.loads(result.stdout)  # Convert string to JSON
    return JsonResponse(json_data)
