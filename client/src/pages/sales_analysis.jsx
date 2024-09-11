import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Statistic, Row, Col, Select, Space, Button, Input, Tabs, Tooltip, Typography, Divider } from 'antd';
import { Line } from 'react-chartjs-2';
import { SearchOutlined, InfoCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import { generateCsv } from 'export-to-csv';
import 'chart.js/auto';

const { Option } = Select;
const { TabPane } = Tabs;
const { Title } = Typography;
const api_address = process.env.REACT_APP_API_ADDRESS;
const SaleAnalysis = () => {
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProductsSold, setTotalProductsSold] = useState(0);
  const [period, setPeriod] = useState('yearly');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetchSalesAnalysis();
  }, [period]);

  useEffect(() => {
    filterData();
  }, [searchTerm, salesData]);

  const fetchSalesAnalysis = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${api_address}/products/sales/analysis`, {
        params: { period },
      });

      const sales = response.data.sales || [];
      setSalesData(sales);

      // Calculate totals
      const totalSales = sales.length;
      const totalRevenue = sales.reduce((acc, sale) => acc + parseFloat(sale.total_amount), 0);
    //   const totalProductsSold = sales.reduce((acc, sale) => acc + sale.quantity, 0);

      setTotalSales(totalSales);
      setTotalRevenue(totalRevenue);
      setTotalProductsSold(response.data.totalProductsSold);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sales analysis:', error);
      setLoading(false);
    }
  };

  const filterData = () => {
    const filtered = salesData.filter(
      (sale) =>
        sale.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.sale_id.toString().includes(searchTerm)
    );
    setFilteredData(filtered);
  };

  const handlePeriodChange = (value) => {
    setPeriod(value);
  };

  const handleExport = () => {
    const csvOptions = {
      headers: ['Sale ID', 'Product Name', 'Quantity', 'Total Amount', 'Sale Date'],
      data: filteredData.map((sale) => [
        sale.sale_id,
        sale.product_name,
        sale.quantity,
        `$${parseFloat(sale.total_amount).toFixed(2)}`,
        new Date(sale.sale_date).toLocaleDateString(),
      ]),
    };
    generateCsv(csvOptions);
  };

  const chartData = {
    labels: filteredData.map((sale) => sale.sale_date),
    datasets: [
      {
        label: 'Quantity Sold',
        data: filteredData.map((sale) => sale.quantity),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
      {
        label: 'Total Amount',
        data: filteredData.map((sale) => sale.total_amount),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    // <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
    <>
      <Title level={2} style={{ textAlign: 'center' }}>Sales Analysis</Title>

      

      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col span={8}>
          <Card hoverable>
            <Statistic
              title={<Tooltip title="Total number of sales">Total Sales <InfoCircleOutlined /></Tooltip>}
              value={totalSales}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card hoverable>
            <Statistic
              title={<Tooltip title="Total revenue generated">Total Revenue <InfoCircleOutlined /></Tooltip>}
              value={`${Number(totalRevenue).toFixed(2)}`}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card hoverable>
            <Statistic
              title={<Tooltip title="Total number of products sold">Total Products Sold <InfoCircleOutlined /></Tooltip>}
              value={totalProductsSold}
            />
          </Card>
        </Col>
      </Row>

      <Divider orientation="left">Sales Overview</Divider>
      <Space style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* <Select
          value={period}
          onChange={handlePeriodChange}
          style={{ width: 200, marginBottom: 10 }}
        >
          <Option value="yearly">Yearly</Option>
          <Option value="quarterly">Quarterly</Option>
          <Option value="monthly">Monthly</Option>
          <Option value="daily">Daily</Option>
        </Select> */}
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search by Product or Sale ID"
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300, marginBottom: 10 }}
        />
        {/* <Tooltip title="Export to CSV">
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExport}
            style={{ backgroundColor: '#001529', color: '#fff' }}
          >
            Export
          </Button>
        </Tooltip> */}
      </Space>
      <Tabs defaultActiveKey="1" style={{ marginTop: '20px' }}>
        
        <TabPane tab="Sales Visualization" key="1">
            
          <Line
            data={chartData}
            options={{
              plugins: {
                legend: {
                  labels: {
                    color: '#333',
                  },
                },
              },
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  ticks: {
                    color: '#333',
                  },
                },
                y: {
                  ticks: {
                    color: '#333',
                  },
                },
              },
            }}
            style={{ height: '500px' }}
          />
        </TabPane>
      </Tabs>
    {/* </div> */}
    </>
  );
};

export default SaleAnalysis;
