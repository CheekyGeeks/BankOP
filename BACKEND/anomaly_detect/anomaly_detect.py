import psutil
import socket
import os
import time
import ctypes
import cv2
import win32com.client
import subprocess

# Define whitelists and blacklists
whitelisted_ips = ["127.0.0.1", "192.168.1.100", "10.0.0.5"]  # Allow essential and local IPs
blacklisted_processes = [
    "keylogger.exe", "malware.exe", "ransomware.exe", "trojan.exe",
    "unauthorizedapp.exe", "obs64.exe", "bandicam.exe", "screenrecorder.exe"
]

# Essential whitelisted processes for smooth user experience
minimum_whitelisted_processes = [
    "explorer.exe", "python.exe", "chrome.exe", "msedge.exe", "firefox.exe",
    "svchost.exe", "RuntimeBroker.exe", "SearchUI.exe", "ctfmon.exe",
    "System", "System Idle Process", "smartscreen.exe", "dwm.exe",
    "taskhostw.exe", "winlogon.exe", "csrss.exe", "services.exe",
    "spoolsv.exe", "conhost.exe", "dllhost.exe", "SecurityHealthService.exe"
]

# Function to detect and optionally terminate unnecessary background processes
def detect_and_kill_unnecessary_processes():
    unnecessary = []
    for proc in psutil.process_iter(['pid', 'name']):
        try:
            proc_name = proc.info['name']
            if proc_name and proc_name.lower() not in [p.lower() for p in minimum_whitelisted_processes]:
                if proc_name.lower() in [bp.lower() for bp in blacklisted_processes]:
                    unnecessary.append(proc_name)
                    proc.kill()
        except Exception:
            continue
    return list(set(unnecessary))

# Function to check for non-whitelisted IPs
def detect_non_whitelisted_ips():
    suspicious_ips = []
    for conn in psutil.net_connections(kind='inet'):
        try:
            ip = conn.raddr.ip if conn.raddr else None
            if ip and ip not in whitelisted_ips:
                suspicious_ips.append(ip)
        except Exception:
            continue
    return list(set(suspicious_ips))

# Function to detect USB device insertions
def detect_usb_devices():
    try:
        wmi = win32com.client.GetObject("winmgmts:")
        usb_devices = wmi.InstancesOf("Win32_USBHub")
        device_list = [device.DeviceID for device in usb_devices]
        return device_list
    except Exception:
        return []

# Improved function to detect camera hijack by checking frame capture
def is_camera_in_use():
    try:
        camera = cv2.VideoCapture(0, cv2.CAP_DSHOW)
        if camera.isOpened():
            ret, frame = camera.read()
            camera.release()
            if not ret:
                return True  # Camera opened but cannot read frame
            return False
        return True  # Camera blocked or in use
    except Exception:
        return False

# Function to detect third-party browser tabs (simplified)
def detect_third_party_browser_tabs():
    third_party_detected = []
    for proc in psutil.process_iter(['pid', 'name']):
        try:
            name = proc.info['name'].lower()
            if name in ["chrome.exe", "firefox.exe", "msedge.exe"]:
                third_party_detected.append(name)
        except Exception:
            continue
    return list(set(third_party_detected))

# Function to display alert
def show_alert(message):
    ctypes.windll.user32.MessageBoxW(0, message, "Anomaly Detected!", 1)

# Main monitoring function
def monitor_system():
    print("Monitoring system for anomalies...")
    while True:
        anomalies = []

        killed_processes = detect_and_kill_unnecessary_processes()
        if killed_processes:
            anomalies.append(f"Terminated blacklisted/unnecessary processes: {', '.join(killed_processes)}")

        bad_ips = detect_non_whitelisted_ips()
        if bad_ips:
            anomalies.append(f"Connected to non-whitelisted IPs: {', '.join(bad_ips)}")

        usb_devices = detect_usb_devices()
        if usb_devices:
            anomalies.append(f"USB devices connected: {', '.join(usb_devices)}")

        if is_camera_in_use():
            anomalies.append("Camera is in use by another process (Possible hijack)")

        third_party_tabs = detect_third_party_browser_tabs()
        if third_party_tabs:
            anomalies.append("Third-party browser tabs detected. Close all browser tabs before proceeding with payment.")

        if anomalies:
            alert_message = "\n".join(anomalies)
            print("\n[ALERT] Anomalies Detected:")
            print(alert_message)
            show_alert(alert_message)

        time.sleep(5)

if __name__ == "__main__":
    monitor_system()
