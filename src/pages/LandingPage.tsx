import { Box, Container, Typography, CircularProgress, Card, CardMedia, CardContent, Grid, createTheme, ThemeProvider } from '@mui/material';
import { useEffect, useState } from 'react';
import apiService from '../api/ApiService';
import type { TextContent, ImageContent } from '../types';

const landingPageTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: ['SofiaHandwritten', 'Roboto', 'sans-serif'].join(','),
  },
});

export const LandingPage = () => {
  const [texts, setTexts] = useState<TextContent[]>([]);
  const [images, setImages] = useState<ImageContent[]>([]);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const pageId = 1;
    const fetchContentMetadata = async () => {
      try {
        setLoading(true);
        const [textsResponse, imagesResponse] = await Promise.all([
          apiService.get(`/content/pages/${pageId}/texts`),
          apiService.get(`/content/pages/${pageId}/images`)
        ]);
        setTexts(textsResponse.data);
        setImages(imagesResponse.data);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar metadados do conteúdo:", err);
        setError('Não foi possível carregar o conteúdo da página.');
      } finally {
        setLoading(false);
      }
    };
    fetchContentMetadata();
  }, []);

  useEffect(() => {
    if (images.length === 0) return;
    const fetchImageBlobs = async () => {
      const urls: Record<string, string> = {};
      for (const image of images) {
        try {
          const response = await apiService.get(image.url, {
            responseType: 'blob',
          });
          const objectURL = URL.createObjectURL(response.data);
          urls[image.id] = objectURL;
        } catch (error) {
          console.error(`Erro ao buscar imagem ${image.id}:`, error);
        }
      }
      setImageUrls(urls);
    };
    fetchImageBlobs();
    return () => {
      Object.values(imageUrls).forEach(URL.revokeObjectURL);
    };
  }, [images]);

  const renderContent = () => {
    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
      <>
        {texts.map((text) => (
          <Box key={text.id} my={4} sx={{ textAlign: 'center' }}>
            <Typography variant="h4" component="h2" gutterBottom>
              {text.identifierTag.replace(/_/g, ' ')}
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {text.content}
            </Typography>
          </Box>
        ))}

        <Grid container spacing={4} mt={4} justifyContent="center">
          {images.map((image) => (
            <Grid item key={image.id} xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  image={imageUrls[image.id] || ''}
                  alt={image.altText}
                  height="200"
                  sx={{ objectFit: 'cover', backgroundColor: '#333' }}
                />
                <CardContent>
                  <Typography variant="caption" color="text.secondary">
                    {image.altText}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </>
    );
  };

  return (
    <ThemeProvider theme={landingPageTheme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          minHeight: '100vh',
          width: '100%',
          py: 5,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold" color="primary.main" textAlign="center">
            Bem-vindo!
          </Typography>
          <Box mt={4}>
            {renderContent()}
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};