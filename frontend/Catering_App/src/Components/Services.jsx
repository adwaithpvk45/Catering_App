import React from 'react'
// import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

const images = [
    {
        id: 1,
        url: 'https://teresajohnson.com/wp-content/uploads/2024/02/the-lace-factory-ct-7.jpg',
        title: 'Wedding',
        width: '40%',
    },
    {
        id: 2,
        url: 'https://roomescapedc.com/wp-content/uploads/2024/01/birthday-party-fairfax-1024x585.png',
        title: 'Birthday',
        width: '30%',
    },
    {
        id: 3,
        url: 'https://cdn2.momjunction.com/wp-content/uploads/2021/10/Light-Up.jpg.webp',
        title: 'Anniversary',
        width: '30%',
    },
    {
        id: 4,
        url: 'https://www.richmondamerican.com/blog/wp-content/uploads/2018/06/housewarming_party-1.jpg',
        title: 'House Warming',
        width: '35%',
    },
    {
        id: 5,
        url: 'https://yourteenmag.com/wp-content/uploads/2023/04/No-Graduation-Party.jpg',
        title: 'Graduation Party',
        width: '35%',
    }
];


  
  const ImageButton = styled(ButtonBase)(({ theme }) => ({
    position: 'relative',
    height: 400,
    [theme.breakpoints.down('sm')]: {
      width: '100% !important', // Overrides inline-style
      height: 100,
    },
    '&:hover, &.Mui-focusVisible': {
      zIndex: 1,
      '& .MuiImageBackdrop-root': {
        opacity: 0.15,
      },
      '& .MuiImageMarked-root': {
        opacity: 0,
      },
      '& .MuiTypography-root': {
        border: '4px solid currentColor',
      },
    },
  }));
  
  const ImageSrc = styled('span')({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%',
  });
  
  const Image = styled('span')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
  }));
  
  const ImageBackdrop = styled('span')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create('opacity'),
  }));
  
  const ImageMarked = styled('span')(({ theme }) => ({
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity'),
  }));
  

function Services() {
  return (
     <div className='flex flex-col p-10 '>
        <div className='flex '>
        <h1 className='text-5xl'>Services<span className='text-amber-300 text-9xl'>.</span></h1>
        </div>
        <div className='flex'>
        <Box sx={{ display: 'flex', minWidth: 300, width: '100%' , padding:"80px"}} className="carousel rounded-box">
      {images.map((image) => (
        <ImageButton
          focusRipple
          key={image.title}
          style={{
            width: image.width,
          }}

          className='carousel-item'
        >
          <ImageSrc style={{ backgroundImage: `url(${image.url})` }} />
          <ImageBackdrop className="MuiImageBackdrop-root" />
          <Image>
            <Typography
              component="span"
              variant="subtitle1"
              color="inherit"
              sx={(theme) => ({
                position: 'relative',
                p: 4,
                pt: 2,
                pb: `calc(${theme.spacing(1)} + 6px)`,
              })}
            >
              {image.title}
              <ImageMarked className="MuiImageMarked-root" />
            </Typography>
          </Image>
        </ImageButton>
      ))}
    </Box>
        </div>
        <div>
                <Link><button className="btn btn-warning btn-xs sm:btn-sm md:btn-md ">View All</button></Link>
        </div>

     </div>
)
}

export default Services