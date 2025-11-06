import React, { useState, useEffect } from 'react';
import Card from '../../../Components/UI/Card';
import classes from './SystemAnalytics.module.css';

const SystemAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    overview: {
      totalRevenue: 45672.50,
      totalOrders: 1284,
      totalUsers: 156,
      totalRestaurants: 23,
      avgOrderValue: 35.60,
      conversionRate: 12.5
    },
    monthlyStats: [
      { month: 'Jan', orders: 120, revenue: 4280 },
      { month: 'Feb', orders: 150, revenue: 5340 },
      { month: 'Mar', orders: 180, revenue: 6420 },
      { month: 'Apr', orders: 200, revenue: 7120 },
      { month: 'May', orders: 220, revenue: 7840 },
      { month: 'Jun', orders: 190, revenue: 6760 }
    ],
    topRestaurants: [
      { name: 'Pizza Palace', orders: 245, revenue: 8750 },
      { name: 'Burger Junction', orders: 198, revenue: 6930 },
      { name: 'Sushi Express', orders: 156, revenue: 7020 },
      { name: 'Taco Fiesta', orders: 134, revenue: 4680 },
      { name: 'Italian Corner', orders: 112, revenue: 5040 }
    ],
    recentTrends: {
      orderGrowth: '+15.2%',
      revenueGrowth: '+18.7%',
      userGrowth: '+22.3%',
      restaurantGrowth: '+8.1%'
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div className={classes.loading}>Loading analytics...</div>;
  }

  return (
    <div className={classes.container}>
      <h1>System Analytics</h1>

      {/* Overview Stats */}
      <div className={classes.overviewSection}>
        <h2>Platform Overview</h2>
        <div className={classes.overviewGrid}>
          <Card className={classes.overviewCard}>
            <div className={classes.cardHeader}>
              <span className={classes.cardIcon}>💰</span>
              <span className={classes.trend}>
                {analytics.recentTrends.revenueGrowth}
              </span>
            </div>
            <div className={classes.cardValue}>
              ${analytics.overview.totalRevenue.toLocaleString()}
            </div>
            <div className={classes.cardLabel}>Total Revenue</div>
          </Card>

          <Card className={classes.overviewCard}>
            <div className={classes.cardHeader}>
              <span className={classes.cardIcon}>📦</span>
              <span className={classes.trend}>
                {analytics.recentTrends.orderGrowth}
              </span>
            </div>
            <div className={classes.cardValue}>
              {analytics.overview.totalOrders.toLocaleString()}
            </div>
            <div className={classes.cardLabel}>Total Orders</div>
          </Card>

          <Card className={classes.overviewCard}>
            <div className={classes.cardHeader}>
              <span className={classes.cardIcon}>👥</span>
              <span className={classes.trend}>
                {analytics.recentTrends.userGrowth}
              </span>
            </div>
            <div className={classes.cardValue}>
              {analytics.overview.totalUsers}
            </div>
            <div className={classes.cardLabel}>Active Users</div>
          </Card>

          <Card className={classes.overviewCard}>
            <div className={classes.cardHeader}>
              <span className={classes.cardIcon}>🏪</span>
              <span className={classes.trend}>
                {analytics.recentTrends.restaurantGrowth}
              </span>
            </div>
            <div className={classes.cardValue}>
              {analytics.overview.totalRestaurants}
            </div>
            <div className={classes.cardLabel}>Restaurants</div>
          </Card>
        </div>
      </div>

      {/* Monthly Performance */}
      <div className={classes.performanceSection}>
        <h2>Monthly Performance</h2>
        <Card className={classes.performanceCard}>
          <div className={classes.chartContainer}>
            <div className={classes.chartHeader}>
              <h3>Orders & Revenue Trend</h3>
            </div>
            <div className={classes.chartData}>
              {analytics.monthlyStats.map((stat, index) => (
                <div key={index} className={classes.chartBar}>
                  <div className={classes.barContainer}>
                    <div 
                      className={classes.orderBar}
                      style={{ height: `${(stat.orders / 250) * 100}px` }}
                    ></div>
                    <div 
                      className={classes.revenueBar}
                      style={{ height: `${(stat.revenue / 8000) * 100}px` }}
                    ></div>
                  </div>
                  <div className={classes.barLabel}>
                    <div>{stat.month}</div>
                    <div className={classes.barStats}>
                      <small>{stat.orders} orders</small>
                      <small>${stat.revenue}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className={classes.chartLegend}>
              <div className={classes.legendItem}>
                <span className={classes.orderLegend}></span>
                Orders
              </div>
              <div className={classes.legendItem}>
                <span className={classes.revenueLegend}></span>
                Revenue
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Restaurants */}
      <div className={classes.topRestaurantsSection}>
        <h2>Top Performing Restaurants</h2>
        <Card className={classes.topRestaurantsCard}>
          <div className={classes.restaurantsList}>
            {analytics.topRestaurants.map((restaurant, index) => (
              <div key={index} className={classes.restaurantItem}>
                <div className={classes.restaurantRank}>
                  #{index + 1}
                </div>
                <div className={classes.restaurantInfo}>
                  <h4>{restaurant.name}</h4>
                  <div className={classes.restaurantStats}>
                    <span>{restaurant.orders} orders</span>
                    <span>${restaurant.revenue} revenue</span>
                  </div>
                </div>
                <div className={classes.performanceBar}>
                  <div 
                    className={classes.performanceFill}
                    style={{ 
                      width: `${(restaurant.revenue / analytics.topRestaurants[0].revenue) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className={classes.metricsSection}>
        <h2>Key Performance Metrics</h2>
        <div className={classes.metricsGrid}>
          <Card className={classes.metricCard}>
            <h3>Average Order Value</h3>
            <div className={classes.metricValue}>
              ${analytics.overview.avgOrderValue}
            </div>
            <div className={classes.metricChange}>+5.2% from last month</div>
          </Card>

          <Card className={classes.metricCard}>
            <h3>Conversion Rate</h3>
            <div className={classes.metricValue}>
              {analytics.overview.conversionRate}%
            </div>
            <div className={classes.metricChange}>+2.1% from last month</div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SystemAnalytics;