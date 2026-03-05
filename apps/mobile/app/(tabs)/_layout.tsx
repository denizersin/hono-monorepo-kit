import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';

const activeColor = '#27D8CE';
const inactiveColor = '#2C7E8A';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: '#041A27',
          borderTopColor: '#0B2D3E',
          height: 84,
          paddingTop: 10,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ width: 28, height: 28, alignItems: 'center', justifyContent: 'center' }}>
              <MaterialCommunityIcons name="zodiac-gemini" size={22} color={color} />
              <View
                style={{
                  position: 'absolute',
                  top: -7,
                  right: -10,
                  backgroundColor: '#FF6258',
                  minWidth: 17,
                  height: 17,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 3,
                }}>
                <Text style={{ color: '#FFF', fontSize: 10, fontWeight: '700' }}>{focused ? '6' : '6'}</Text>
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="readings"
        options={{
          title: 'Readings',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="hand-back-right-outline" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="compatibility"
        options={{
          title: 'Compatibility',
          tabBarIcon: ({ color }) => <Ionicons name="heart-half-outline" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="guides"
        options={{
          title: 'Guides',
          tabBarIcon: ({ color }) => <Feather name="book-open" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="birth-chart"
        options={{
          title: 'Birth Chart',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="hexagram-outline" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
