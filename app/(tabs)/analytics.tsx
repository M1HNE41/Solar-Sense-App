// Refactored analytics_nou.tsx to match the design of history_vechi.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';

const SERVER_URL = 'https://esp32-server-lyo0.onrender.com';
const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen() {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistoricalData = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/data`);
      const result = await response.json();
      console.log("Raw data:", result);
      if (Array.isArray(result)) {
        setHistoricalData(result.reverse());
      }
    } catch (error) {
      console.error('Error fetching historical data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoricalData();
  }, []);

  const filteredData = historicalData.slice(0, timeRange === 'daily' ? 12 : timeRange === 'weekly' ? 24 : 48);
  const chartLabels = filteredData.map(d => new Date(d.timestamp).toLocaleTimeString());
  const chartValues = filteredData.map(d => typeof d.power === 'number' ? d.power : 0);

  const getChartTitle = () => {
    switch (timeRange) {
      case 'daily': return "Today's Production";
      case 'weekly': return "This Week's Production";
      case 'monthly': return "This Year's Production";
    }
  };

  const getChartUnit = () => timeRange === 'daily' ? 'kW' : 'kWh';

  const peak = chartValues.length ? Math.max(...chartValues) : 0;
  const average = chartValues.length ? chartValues.reduce((a, b) => a + b, 0) / chartValues.length : 0;
  const total = chartValues.length ? chartValues.reduce((a, b) => a + b, 0) : 0;

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  if (!chartValues.length) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Text style={styles.title}>Analytics</Text>
          <Text style={{ color: '#7f8c8d', textAlign: 'center', marginTop: 40 }}>No data available to display.</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Analytics</Text>

        <View style={styles.timeRangeSelector}>
          {['daily', 'weekly', 'monthly'].map(range => (
            <TouchableOpacity
              key={range}
              style={[styles.timeRangeButton, timeRange === range && styles.activeTimeRange]}
              onPress={() => setTimeRange(range as 'daily' | 'weekly' | 'monthly')}
            >
              <Text style={[styles.timeRangeText, timeRange === range && styles.activeTimeRangeText]}>
                {range === 'daily' ? 'Day' : range === 'weekly' ? 'Week' : 'Year'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>{getChartTitle()}</Text>
          <LineChart
            data={{
              labels: chartLabels,
              datasets: [{ data: chartValues }]
            }}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Peak Production</Text>
              <Text style={styles.statValue}>{peak.toFixed(2)} {getChartUnit()}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Average Production</Text>
              <Text style={styles.statValue}>{average.toFixed(2)} {getChartUnit()}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Production</Text>
              <Text style={styles.statValue}>{total.toFixed(2)} {getChartUnit()}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ... chartConfig and styles remain unchanged ...

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
  style: { borderRadius: 16 },
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#3498db',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  timeRangeSelector: {
    flexDirection: 'row',
    backgroundColor: '#ecf0f1',
    borderRadius: 12,
    marginBottom: 24,
    padding: 4,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTimeRange: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  timeRangeText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  activeTimeRangeText: {
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    color: '#2c3e50',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
  },
  statsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#2c3e50',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  divider: {
    height: 1,
    backgroundColor: '#ecf0f1',
    marginVertical: 8,
  },
});
