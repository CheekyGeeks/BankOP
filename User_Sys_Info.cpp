#include <iostream>
#include <fstream>
#include <string>
#include <sstream>
#include <cstdlib>
#include <array>
#ifdef _WIN32
    #define _WINSOCK_DEPRECATED_NO_WARNINGS
    #include <winsock2.h>
    #include <ws2tcpip.h>
    #include <iphlpapi.h>
    #pragma comment(lib, "iphlpapi.lib")
    #pragma comment(lib, "ws2_32.lib")
#else
    #include <unistd.h>
    #include <sys/socket.h>
    #include <netinet/in.h>
    #include <arpa/inet.h>
    #include <net/if.h>
    #include <netdb.h>
#endif

std::string get_mac_address() {
#ifdef _WIN32
    IP_ADAPTER_INFO AdapterInfo[16];
    DWORD dwBufLen = sizeof(AdapterInfo);
    DWORD dwStatus = GetAdaptersInfo(AdapterInfo, &dwBufLen);
    if (dwStatus == ERROR_SUCCESS) {
        char mac_address[18];
        snprintf(mac_address, sizeof(mac_address), "%02X:%02X:%02X:%02X:%02X:%02X",
                 AdapterInfo->Address[0], AdapterInfo->Address[1], AdapterInfo->Address[2],
                 AdapterInfo->Address[3], AdapterInfo->Address[4], AdapterInfo->Address[5]);
        return std::string(mac_address);
    }
#else
    std::ifstream file("/sys/class/net/eth0/address");
    if (file) {
        std::string mac;
        std::getline(file, mac);
        return mac;
    }
#endif
    return "Could not retrieve";
}

std::string get_local_ip() {
#ifdef _WIN32
    WSADATA wsaData;
    if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0) {
        return "Could not initialize Winsock";
    }
    char hostname[256];
    if (gethostname(hostname, sizeof(hostname)) == SOCKET_ERROR) {
        WSACleanup();
        return "Could not retrieve hostname";
    }
    struct addrinfo hints = {0}, *res;
    hints.ai_family = AF_INET;
    if (getaddrinfo(hostname, NULL, &hints, &res) != 0) {
        WSACleanup();
        return "Could not retrieve address";
    }
    char ip_str[INET_ADDRSTRLEN];
    struct sockaddr_in* addr = (struct sockaddr_in*)res->ai_addr;
    inet_ntop(AF_INET, &addr->sin_addr, ip_str, sizeof(ip_str));
    freeaddrinfo(res);
    WSACleanup();
    return std::string(ip_str);
#else
    return "Not implemented for Linux";
#endif
}

std::string get_public_ip() {
    return "(Fetch via external API in real-world usage)";
}

std::string get_serial_number() {
#ifdef _WIN32
    char buffer[128];
    FILE* pipe = _popen("wmic bios get serialnumber", "r");
    if (!pipe) return "Could not retrieve";
    fgets(buffer, 128, pipe);
    fgets(buffer, 128, pipe);
    _pclose(pipe);
    return std::string(buffer);
#elif __linux__
    std::ifstream file("/sys/class/dmi/id/product_serial");
    std::string serial;
    if (file) std::getline(file, serial);
    return serial.empty() ? "Could not retrieve" : serial;
#else
    return "Could not retrieve";
#endif
}

std::string get_bios_uuid() {
#ifdef _WIN32
    char buffer[128];
    FILE* pipe = _popen("wmic csproduct get UUID", "r");
    if (!pipe) return "Could not retrieve";
    fgets(buffer, 128, pipe);
    fgets(buffer, 128, pipe);
    _pclose(pipe);
    return std::string(buffer);
#elif __linux__
    std::ifstream file("/sys/class/dmi/id/product_uuid");
    std::string uuid;
    if (file) std::getline(file, uuid);
    return uuid.empty() ? "Could not retrieve" : uuid;
#else
    return "Could not retrieve";
#endif
}

std::string get_gateway() {
#ifdef _WIN32
    char buffer[128];
    FILE* pipe = _popen("ipconfig | findstr /i \"Default Gateway\"", "r");
    if (!pipe) return "Could not retrieve";
    fgets(buffer, 128, pipe);
    _pclose(pipe);
    return std::string(buffer);
#elif __linux__
    char buffer[128];
    FILE* pipe = popen("ip route | grep default | awk '{print $3}'", "r");
    if (!pipe) return "Could not retrieve";
    fgets(buffer, sizeof(buffer), pipe);
    pclose(pipe);
    return std::string(buffer);
#else
    return "Could not retrieve";
#endif
}

// ✅ New function that returns JSON
std::string get_system_info_json() {
    std::ostringstream json_output;
    json_output << "{\n";
    json_output << "  \"MAC Address\": \"" << get_mac_address() << "\",\n";
    json_output << "  \"Local IP Address\": \"" << get_local_ip() << "\",\n";
    json_output << "  \"Public IP Address\": \"" << get_public_ip() << "\",\n";
    json_output << "  \"Serial Number\": \"" << get_serial_number() << "\",\n";
    json_output << "  \"BIOS UUID\": \"" << get_bios_uuid() << "\",\n";
    json_output << "  \"Gateway Interface\": \"" << get_gateway() << "\"\n";
    json_output << "}";

    return json_output.str();
}

// ✅ Modify main() to use the function
int main() {
    std::string json_data = get_system_info_json();
    std::cout << json_data << std::endl;

    // Save to a file (optional)
    std::ofstream file("system_info.json");
    file << json_data;
    file.close();

    return 0;
}
