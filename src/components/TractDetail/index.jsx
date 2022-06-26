import { useEffect, useState, useRef } from 'react';
import { styled } from '@mui/material/styles'
import {
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Grid,
} from '@mui/material'
import {
  MapContainer,
  TileLayer,
  Polygon,
  useMap,
} from 'react-leaflet';

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

const StyledMapContainer = styled(MapContainer)`
  aspect-ratio: 1;
`

const TractDetails = ({
  fid
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [tract, setTract] = useState({});
  const mapRef = useRef();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(
      `http://localhost:5000/tracts/${fid}`,
      { signal }
    )
      .then(res => res.json())
      .then(data => {

        //use latlng for coordinates
        const coordinates = data?.data?.coordinates[0].map(
          latlng => latlng.reverse()
        )

        setIsError(false);
        setTract({
          ...data?.data,
          coordinates,
        });
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
            <StyledMapContainer
              bounds={[
                [49.1106, -97.5807],
                [43.4854, -91.2131]
              ]}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Polygon 
                pathOptions={{
                  color: '#ff9800',
                  fill: '#ff980033'
                }}
                positions={tract?.coordinates}
              />
            </StyledMapContainer>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default TractDetails;
