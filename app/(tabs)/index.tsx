import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { io } from "socket.io-client";

const SERVER_URL = "https://esp32-server-lyo0.onrender.com";
const socket = io(SERVER_URL);

const DashboardScreen = () => {
    const [data, setData] = useState({
        voltage: 0,
        current: 0,
        power: 0,
        status: "Disconnected",
        connected: false,
        trends: { voltage: "stable", current: "stable", power: "stable" },
    });

    const previousData = useRef({ voltage: 0, current: 0, power: 0 });

    useEffect(() => {
        socket.on("connect", () => {
            setData(prev => ({ ...prev, status: "Connected to ESP32", connected: true }));
        });

        socket.on("disconnect", () => {
            setData(prev => ({ ...prev, status: "Disconnected", connected: false }));
        });

        socket.on("updateData", (newData) => {
            if (newData.length > 0) {
                const latestData = newData[0];

                setData(prev => ({
                    ...prev,
                    voltage: latestData.voltage || 0,
                    current: latestData.current || 0,
                    power: latestData.power || 0,
                    trends: {
                        voltage: latestData.voltage > prev.voltage ? "up" : latestData.voltage < prev.voltage ? "down" : prev.trends.voltage,
                        current: latestData.current > prev.current ? "up" : latestData.current < prev.current ? "down" : prev.trends.current,
                        power: latestData.power > prev.power ? "up" : latestData.power < prev.power ? "down" : prev.trends.power,
                    },
                }));

                previousData.current = {
                    voltage: latestData.voltage,
                    current: latestData.current,
                    power: latestData.power,
                };
            }
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("updateData");
            socket.disconnect();
        };
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Solar Dashboard</Text>
                <View style={[styles.connectionBadge, { backgroundColor: data.connected ? "#28A745" : "#DC3545" }]}> 
                    <MaterialCommunityIcons
                        name={
                            data.status === "Connected to ESP32"
                                ? "wifi"
                                : data.status === "Waiting for data..."
                                ? "reload"
                                : "wifi-off"
                        }
                        size={18}
                        color="white"
                    />
                    <Text style={styles.connectionText}>{data.status}</Text>
                </View>
            </View>
            <Text style={styles.subtitle}>Monitor your energy production</Text>

            <Text style={styles.sectionTitle}>Electrical Parameters</Text>
            <View style={styles.cardContainer}>
                <EnergyCard title="Tensiune" value={`${data.voltage} V`} icon="flash" trend={data.trends.voltage} color="#FFA500" />
                <EnergyCard title="Curent" value={`${data.current} A`} icon="speedometer" trend={data.trends.current} color="#007AFF" />
                <EnergyCard title="Putere" value={`${data.power} W`} icon="battery-charging" trend={data.trends.power} color="#28A745" />
            </View>
        </ScrollView>
    );
};

const EnergyCard = ({ title, value, icon, trend, color }) => {
    const trendIcon = trend === "up" ? "arrow-up" : trend === "down" ? "arrow-down" : "remove";
    const trendColor = trend === "up" ? "#28A745" : trend === "down" ? "#DC3545" : "#6C757D";

    return (
        <View style={styles.card}>
            <Ionicons name={icon} size={24} color={color} style={styles.cardIcon} />
            <View>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardValue}>{value}</Text>
            </View>
            <Ionicons name={trendIcon} size={20} color={trendColor} style={styles.trendIcon} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#F8F9FA",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#212529",
    },
    connectionBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    connectionText: {
        color: "white",
        marginLeft: 6,
    },
    subtitle: {
        fontSize: 16,
        color: "#6C757D",
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#212529",
    },
    cardContainer: {
        gap: 10,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        padding: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        marginBottom: 10,
    },
    cardIcon: {
        marginRight: 10,
    },
    cardTitle: {
        fontSize: 14,
        color: "#6C757D",
    },
    cardValue: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#212529",
    },
    trendIcon: {
        marginLeft: "auto",
    }
});

export default DashboardScreen;
