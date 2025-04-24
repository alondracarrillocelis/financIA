import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme, Pressable } from 'react-native';
import Colors from '@/constants/Colors';
import { useUserInfo } from '../context/UserInfoContext';
import { Ionicons } from '@expo/vector-icons';

type ChartPeriod = 'week' | 'month' | 'year';

export default function StatsScreen() {
    const theme = useColorScheme() ?? 'light';
    const colorSet = Colors[theme];
    const { firstName, lastName } = useUserInfo();
    const [activePeriod, setActivePeriod] = useState<ChartPeriod>('month');

    const totalSpending: Record<ChartPeriod, number> = {
        week: 420,
        month: 1200,
        year: 12850
    };

    const expenseCategories = [
        { category: 'Food', amount: '$430', percentage: 36, color: '#FF6384' },
        { category: 'Transport', amount: '$290', percentage: 24, color: '#36A2EB' },
        { category: 'Shopping', amount: '$260', percentage: 22, color: '#FFCE56' },
        { category: 'Entertainment', amount: '$220', percentage: 18, color: '#4BC0C0' }
    ];

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const monthlySpending = Array(6).fill(0).map((_, index) => {
        const monthIndex = (currentMonth - 5 + index + 12) % 12;
        const amounts = [1150, 980, 1250, 1320, 1050, 1200];
        return {
            month: monthNames[monthIndex],
            amount: amounts[index]
        };
    });

    return (
        <ScrollView style={[styles.container, { backgroundColor: colorSet.background }]}>
            <View style={styles.headerSection}>
                <Text style={[styles.headerTitle, { color: colorSet.text }]}>
                    Financial Summary
                </Text>
                <Text style={[styles.headerSubtitle, { color: colorSet.muted }]}>
                    {firstName && lastName
                        ? `${firstName} ${lastName}'s spending analysis`
                        : 'Your spending analysis'}
                </Text>
            </View>

            <View style={styles.periodSelector}>
                {(['week', 'month', 'year'] as ChartPeriod[]).map((period) => (
                    <Pressable
                        key={period}
                        onPress={() => setActivePeriod(period)}
                        style={[
                            styles.periodButton,
                            activePeriod === period && { backgroundColor: colorSet.primary }
                        ]}
                    >
                        <Text style={[
                            styles.periodButtonText,
                            { color: activePeriod === period ? '#fff' : colorSet.text }
                        ]}>
                            {period.charAt(0).toUpperCase() + period.slice(1)}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <View style={[styles.totalCard, { backgroundColor: colorSet.tint }]}>
                <Text style={styles.totalCardLabel}>Total Spending</Text>
                <Text style={styles.totalCardAmount}>
                    ${totalSpending[activePeriod].toLocaleString('en-US')}
                </Text>
                <View style={styles.totalCardFooter}>
                    <Ionicons name="arrow-up" size={14} color="#FF6384" />
                    <Text style={styles.totalCardCompare}>
                        12% more than the previous {activePeriod}
                    </Text>
                </View>
            </View>

            <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colorSet.text }]}>Expense Breakdown</Text>
                    <Pressable>
                        <Text style={[styles.sectionAction, { color: colorSet.primary }]}>See Details</Text>
                    </Pressable>
                </View>

                {expenseCategories.map((expense, index) => (
                    <View key={index} style={styles.expenseItem}>
                        <View style={styles.expenseHeader}>
                            <View style={styles.categoryLabel}>
                                <View style={[styles.categoryDot, { backgroundColor: expense.color }]} />
                                <Text style={[styles.expenseCategory, { color: colorSet.text }]}>
                                    {expense.category}
                                </Text>
                            </View>
                            <Text style={[styles.expenseAmount, { color: colorSet.text }]}>
                                {expense.amount}
                            </Text>
                        </View>
                        <View style={styles.progressBarBackground}>
                            <View
                                style={[
                                    styles.progressBarFill,
                                    { width: `${expense.percentage}%`, backgroundColor: expense.color }
                                ]}
                            />
                        </View>
                        <Text style={[styles.expensePercentage, { color: colorSet.muted }]}>
                            {expense.percentage}%
                        </Text>
                    </View>
                ))}
            </View>

            <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colorSet.text }]}>Spending History</Text>
                    <Pressable>
                        <Text style={[styles.sectionAction, { color: colorSet.primary }]}>Full Report</Text>
                    </Pressable>
                </View>

                <View style={styles.barChartContainer}>
                    {monthlySpending.map((data, index) => (
                        <View key={index} style={styles.barColumn}>
                            <View style={styles.barWrapper}>
                                <View
                                    style={[
                                        styles.bar,
                                        {
                                            height: `${(data.amount / 1500) * 100}%`,
                                            backgroundColor: colorSet.primary
                                        }
                                    ]}
                                />
                            </View>
                            <Text style={[styles.barLabel, { color: colorSet.muted }]}>
                                {data.month}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    headerSection: { marginBottom: 20 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
    headerSubtitle: { fontSize: 16 },
    periodSelector: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 4,
    },
    periodButton: {
        flex: 1,
        borderRadius: 10,
        paddingVertical: 8,
        alignItems: 'center',
    },
    periodButtonText: { fontWeight: '600' },
    totalCard: {
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
    },
    totalCardLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 8,
    },
    totalCardAmount: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 12,
    },
    totalCardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    totalCardCompare: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        marginLeft: 4,
    },
    sectionContainer: {
        marginBottom: 24,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: { fontSize: 18, fontWeight: '600' },
    sectionAction: { fontSize: 14, fontWeight: '500' },
    expenseItem: { marginBottom: 12 },
    expenseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    categoryLabel: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    expenseCategory: { fontSize: 15 },
    expenseAmount: { fontSize: 15, fontWeight: '500' },
    progressBarBackground: {
        height: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
        marginBottom: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    expensePercentage: {
        fontSize: 12,
        textAlign: 'right',
    },
    barChartContainer: {
        flexDirection: 'row',
        height: 200,
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 10,
    },
    barColumn: {
        flex: 1,
        alignItems: 'center',
    },
    barWrapper: {
        width: 30,
        height: 160,
        justifyContent: 'flex-end',
    },
    bar: {
        width: '100%',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    barLabel: {
        marginTop: 8,
        fontSize: 12,
    }
});
