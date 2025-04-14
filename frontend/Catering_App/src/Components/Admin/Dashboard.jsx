import { Box, Card, CardContent, Grid, Paper, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import ReportIcon from "@mui/icons-material/Report";
import ApexCharts from "react-apexcharts";
import dayjs from 'dayjs';

function Dashboard() {

  const stats = [
    { label: "Total Users", value: 124, icon: <PeopleIcon color="primary" sx={{fontSize:50}}/> },
    { label: "Vendors", value: 37, icon: <BusinessIcon color="secondary" sx={{fontSize:50}}/> },
    { label: "Bookings", value: 210, icon: <BookOnlineIcon color="success" sx={{fontSize:50}}/> },
    { label: "Complaints", value: 12, icon: <ReportIcon color="error" sx={{fontSize:50}}/> },
  ];

  const monthlyBookings = [
    { month: "Jan", bookings: 40 },
    { month: "Feb", bookings: 30 },
    { month: "Mar", bookings: 60 },
    { month: "Apr", bookings: 80 },
    { month: "May", bookings: 75 },
  ];
  
  // Dummy category pie
  const serviceCategoryData = [
    { name: "Weddings", value: 400 },
    { name: "Birthdays", value: 300 },
    { name: "Corporate", value: 200 },
    { name: "Others", value: 100 },
  ];


  const lineChartsOptions = {
    chart:{
      id:"monthly-bookings",
      type:"line",
      height:500,
    },
    xaxis:{
      categories:monthlyBookings.map((item)=>item.month)
    },
    stroke:{
      curve:"smooth",
    },
    title:{
      text:"Monthly Bookings",
      align:"left"
    },
  }

  const lineChartSeries = [{
         name:"Bookings",
         data:monthlyBookings.map((item)=>item.bookings)
  }]

  const pieChatOptions = {
    chart:{
      type:'pie',
      height: 400, 
     },
    labels:serviceCategoryData.map((item)=>item.name),
    title:{
      text:"Booking by Catering",
      align:"left",
      // margin:20, 
    }, 
    legend: {
      position: 'bottom', // You can change this to "top" or "left" for different alignment
    },
  }

  const pieChatSeries = serviceCategoryData.map((item)=>item.value)

    const [currentTime,setCurrentTime] = useState(dayjs())
  
    useEffect(()=>{
      const timer = setInterval(()=>{
           setCurrentTime(dayjs())
      },1000)
  
      return ()=> clearInterval(timer)
    },[])



  return (
     <Box p={1} display={'flex'} flexDirection={"column"}>
      <Box display='flex' justifyContent='space-between' sx={{flexDirection:{xs:'column',sm:'column',md:'row'}}}>
      <Typography  variant='h4' marginBottom={3} sx={{fontSize:{xs:'14px',sm:'16px',md:'20px'}}}>
        Admin Dashboard
      </Typography>
      <Paper sx={{height:50,width:{xs:280,sm:300,md:380}}}>
      <Typography gutterBottom  display={'flex'} alignItems={'center'} p={1} borderRadius={2} bgcolor={'white'} sx={{fontSize:{xs:'14px',sm:'16px',md:'20px'}}}>
     {currentTime.format('dddd, MMMM D, YYYY - hh:mm:ss A')}
      </Typography>
        </Paper>     
      </Box>
      <Grid container spacing={3} sx={{paddingTop:5}}>
      {
        stats.map((item,index)=>(
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card elevation={1} sx={{minWidth:'230px',minHeight:'150px'}}>
              <CardContent>
                 <Box display='flex' flexDirection='column' alignItems='center' gap={4} >
                 <Box >
                  <Typography variant='h4' align='center'>{item.value}</Typography>
                  <Typography variant='body2' color='text.secondary'>{item.label}</Typography>
                 </Box>
                 <Box>
                 {item.icon}
                 </Box>
                 </Box>
                </CardContent>  
            </Card>
            </Grid>
        ))
      }
      <Grid container>
      <Grid item xs={12} md={8}>
        <Card elevation={1}>
          <CardContent>
            <ApexCharts options={lineChartsOptions} series={lineChartSeries} type="line" height={300} width={600}/>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4} >
        <Card elevation={1} >
        <CardContent sx={{ height: 355, display: 'flex', justifyContent: 'space-around' }}>
        <ApexCharts options={pieChatOptions} series={pieChatSeries} type="pie" />
          </CardContent>
        </Card>
      </Grid>
      </Grid>
      </Grid>
     </Box>
  )
}

export default Dashboard