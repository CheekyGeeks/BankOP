import psutil
import socket
import os
import time
import ctypes
import cv2
import win32com.client
import subprocess

# === Refined Whitelist Configuration ===

# Whitelisted IPs (Expanded with known legit service IPs)
whitelisted_ips = [
    "127.0.0.1", "192.168.1.100", "10.0.0.5",  # Local & internal
    "140.82.112.25", "157.245.70.148", "3.111.224.186", "54.187.79.143", "20.44.10.122",
    "104.208.16.90", "2a03:2880:f237:1c6:face:b00c:0:7260", "2603:1046:c04:104b::2",
    "2600:140f:2e00::b856:70d8", "2600:140f:2e00::b856:70d9", "2606:4700:8392:7cbc:c2a6:411:5ff2:75c4",
    "2603:1020:206:d::", "2620:1ec:bdf::58"
]

# Whitelisted USB Device IDs (usually internal hubs or allowed known devices)
whitelisted_usb_ids = [
    "USB\\ROOT_HUB30\\5&2D8E40BD&0&0",
    "USB\\ROOT_HUB30\\5&39B8775F&0&0",
    "USB\\VID_3277&PID_0029\\0001",
    "USB\\ROOT_HUB30\\5&96A7DAC&0&0",
    "USB\\ROOT_HUB30\\5&2524570B&0&0",
    "USB\\ROOT_HUB30\\5&108DF2D&0&0"
]

# Blacklisted process names
blacklisted_processes = [
    "keylogger.exe", "malware.exe", "ransomware.exe", "trojan.exe",
    "unauthorizedapp.exe", "obs64.exe", "bandicam.exe", "screenrecorder.exe"
]

# Essential whitelisted system processes
minimum_whitelisted_processes = [
    "explorer.exe", "python.exe", "chrome.exe", "msedge.exe", "firefox.exe",
    "svchost.exe", "RuntimeBroker.exe", "SearchUI.exe", "ctfmon.exe",
    "System", "System Idle Process", "smartscreen.exe", "dwm.exe",
    "taskhostw.exe", "winlogon.exe", "csrss.exe", "services.exe",
    "spoolsv.exe", "conhost.exe", "dllhost.exe", "SecurityHealthService.exe"
]

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

def detect_usb_devices():
    try:
        wmi = win32com.client.GetObject("winmgmts:")
        usb_devices = wmi.InstancesOf("Win32_USBHub")
        device_list = [device.DeviceID for device in usb_devices]
        non_whitelisted = [d for d in device_list if d not in whitelisted_usb_ids]
        return non_whitelisted
    except Exception:
        return []

def is_camera_in_use():
    try:
        camera = cv2.VideoCapture(0, cv2.CAP_DSHOW)
        if camera.isOpened():
            ret, frame = camera.read()
            camera.release()
            return not ret
        return True
    except Exception:
        return False

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

def show_alert(message):
    ctypes.windll.user32.MessageBoxW(0, message, "⚠️ Anomaly Detected", 1)

def monitor_system():
    print("🔍 Monitoring system for anomalies...")
    while True:
        anomalies = []

        killed_processes = detect_and_kill_unnecessary_processes()
        if killed_processes:
            anomalies.append(f"🛑 Terminated blacklisted/unnecessary processes: {', '.join(killed_processes)}")

        bad_ips = detect_non_whitelisted_ips()
        if bad_ips:
            anomalies.append(f"🌐 Connected to non-whitelisted IPs: {', '.join(bad_ips)}")

        usb_devices = detect_usb_devices()
        if usb_devices:
            anomalies.append(f"🔌 USB devices connected: {', '.join(usb_devices)}")

        if is_camera_in_use():
            anomalies.append("📷 Camera is in use by another process (Possible hijack)")

        third_party_tabs = detect_third_party_browser_tabs()
        if third_party_tabs:
            anomalies.append("🧭 Third-party browser tabs detected. Please close all tabs before payment.")

        if anomalies:
            alert_message = "\n".join(anomalies)
            print("\n[ALERT] Anomalies Detected:\n" + alert_message)
            show_alert(alert_message)

        time.sleep(5)

if __name__ == "__main__":
    monitor_system()
