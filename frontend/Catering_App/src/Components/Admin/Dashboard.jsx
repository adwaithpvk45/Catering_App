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
    },
    xaxis:{
      categories:monthlyBookings.map((item)=>item.month)
    },
    stroke:{
      curve:"smooth",
    },
    title:{
      text:"Monthly Bookings",
      align:"left",
      style:{
        fontSize:'15px',
    },
    responsive:[
      {
        breakpoint:365,
        options:{
          title: {
            style: {
              fontSize: '7px' // correct way to apply fontSize
            }
          }
        }
      }
    ]
    }
  }

  const lineChartSeries = [{
         name:"Bookings",
         data:monthlyBookings.map((item)=>item.bookings)
  }]

  const donutChatOptions = {
    chart:{
      type:'Donut',  
      maxWidth:600,
      maxHeight:700,
     },
     plotOptions: {
      pie: {
        donut: {
          size: '50%'
        }
      }
    },
    labels:serviceCategoryData.map((item)=>item.name),
    colors: ['#FFA726', '#FFB74D', '#FFCC80', '#FFE0B2'], // ⚠️ warning shades
    title:{
      text:"Service Booking ",
      align:"left",
      style:{
        fontSize:'16px'
      }
    },
     legend: {
      position: 'right', // You can change this to "top" or "left" for different alignment'
      fontSize:'17px'
    },
    responsive: [
      {
        breakpoint: 1330, // for small screens
        options: {
          legend: {
            position: 'bottom', // or 'left'
            fontSize: '12px'
          },
          plotOptions: {
            pie: {
              donut: {
                size: '60%'
              }
            }
          },
        },
      }, 
      {
        breakpoint: 1200, // for small screens
        options: {
          legend: {
            position: 'bottom', // or 'left'
            fontSize: '12px'
          },
          plotOptions: {
            pie: {
              donut: {
                size: '60%'
              }
            }
          },
        },
      }, 
      {
        breakpoint: 899, // for small screens
        options: {
          legend: {
            position: 'bottom', // or 'left'
            fontSize: '20px'
          },
          plotOptions: {
            pie: {
              donut: {
                size: '50%'
              }
            }
          },
        }
      },   
      {
        breakpoint: 768, // for small screens
        options: {
          legend: {
            position: 'bottom', // or 'left'
            fontSize: '15px'
          },
          plotOptions: {
            pie: {
              donut: {
                size: '50%'
              }
            }
          },
        }
      },
      {
        breakpoint: 670, // for small screens
        options: {
          legend: {
            position: 'bottom', // or 'left'
            fontSize: '15px'
          },
        }
      },
    {
      breakpoint: 470, // for small screens
        options: {
          legend: {
            position: 'right', // or 'left'
            fontSize: '12px'
          },
        }
    },
    {
      breakpoint: 350, // for small screens
        options: {
          legend: {
            position: 'bottom', // or 'left'
            fontSize: '10px'
          },
        }
    },
  ]
    }

  const donutChatSeries = serviceCategoryData.map((item)=>item.value)

    const [currentTime,setCurrentTime] = useState(dayjs())
  
    useEffect(()=>{
      const timer = setInterval(()=>{
           setCurrentTime(dayjs())
      },1000)
  
      return ()=> clearInterval(timer)
    },[])



  return (
     <Box  display={'flex'} flexDirection={"column"} >
      <Box display='flex' justifyContent='space-between' sx={{flexDirection:{xs:'column',sm:'column',md:'row'}}}>
      <Typography  variant='h4' marginBottom={3} sx={{fontSize:{xs:'14px',sm:'16px',md:'20px'},m:3}}>
        Admin Dashboard
      </Typography>
      <Paper sx={{height:50,width:{xs:280,sm:300,md:400},m:3}}>
      <Typography gutterBottom  display={'flex'} alignItems={'center'} p={1} borderRadius={2} bgcolor={'white'} sx={{fontSize:{xs:'14px',sm:'16px',md:'20px'}}}>
     {currentTime.format('dddd, MMMM D, YYYY - hh:mm:ss A')}
      </Typography>
        </Paper>     
      </Box>
      <Grid container  sx={{paddingTop:5,paddingRight:4,justifyContent:{xs:'center',md:'normal'}}} rowSpacing={5} columnSpacing={5} >
      {
        stats.map((item,index)=>(
          <Grid item size={{xs:12,sm:6,md:3}} key={index} sx={{width:'250px',borderRadius:'30px',overflow:'clip'}}>
            <Card elevation={2}>
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
      {/* <Box display={'flex'}>  */}
      <Grid container spacing={1} sx={{marginBottom:4,maxWidth:'100'}} columnSpacing={5} rowSpacing={5}> 
      <Grid item size={{xs:12,md:8}}>
        <Card elevation={1}>
          <CardContent >
            <ApexCharts options={lineChartsOptions} series={lineChartSeries} type="line" />
          </CardContent>
          {/* <CardContent sx={{display: 'flex'}}>
        <ApexCharts options={pieChatOptions} series={pieChatSeries} type="pie" />
          </CardContent> */}
        </Card>
      </Grid>
      <Grid item size={{xs:12,md:4}} >
        <Card elevation={ 2 } sx={{minHeight:{xs:'200px',sm:'250px',md:'295px',lg:'345px',xl:'385px'},minWidth:{xs:'200px',sm:'250px',md:'280px',lg:'400px',xl:'500px'}}} > 
        <CardContent sx={{width:"100%",paddingBottom:0,height:'100%',}}>
        <ApexCharts options={donutChatOptions} series={donutChatSeries} type="donut" width={"100%"} />
          </CardContent>
          {/* <CardContent >
            <ApexCharts options={lineChartsOptions} series={lineChartSeries} type="line" />
          </CardContent> */}
        </Card>
      </Grid>
      </Grid>
      {/* </Box> */}
      </Grid>
     </Box>
  )
}

export default Dashboard