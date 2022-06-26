import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles'
import {
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Grid,
} from '@mui/material'

import counties from '../../constants/counties'

const Term = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: '#9e9e9e',
  display: 'inline',
  marginRight: theme.spacing(1),
}));

const Text = styled(Typography)(({ theme }) => ({
  display: 'inline',
}));

const TractDetails = ({
  fid
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [tract, setTract] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(
      `http://localhost:5000/tracts/${fid}`,
      { signal }
    )
      .then(res => res.json())
      .then(data => {
        setIsError(false);
        setTract(data?.data);
      })
      .catch(() => {
        setIsError(true)
      })
      .finally(() => {
        setIsLoading( false)
      })
    
    return () => { controller.abort() }
  }, [fid]);

  return (
    <Card sx={{
      width: '50%',
      maxWidth: '30em',
    }}>
      <CardContent>
        { isLoading && <CircularProgress /> }
        { isError && (<Typography>Error</Typography>)}
        {tract.name && (
          <>
            <Typography
              variant='h2'
              fontSize={20}
              fontWeight='bold'
              mb={4}
            >{tract.name}</Typography>
            <Grid container spacing={2} columns={12}>
              <Grid item xs={6}>
                <Term>
                  County:
                </Term>
                <Text>
                  {counties[tract?.county]}
                </Text>
              </Grid>
              <Grid item xs={6}>
                <Term>
                  State:
                </Term>
                <Text>
                  Minnesota
                </Text>
              </Grid>
              <Grid item xs={6}>
                <Term>
                  Land area:
                </Term>
                <Text>
                  {tract?.areaLand}
                </Text>
              </Grid>
              <Grid item xs={6}>
                <Term>
                  Water area:
                </Term>
                <Text>
                  {tract?.areaWater}
                </Text>
              </Grid>
            </Grid>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default TractDetails;
