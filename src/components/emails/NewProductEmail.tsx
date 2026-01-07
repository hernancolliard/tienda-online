import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface NewProductEmailProps {
  productName: string;
  productDescription: string;
  productImage: string;
  productUrl: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const NewProductEmail = ({
  productName,
  productDescription,
  productImage,
  productUrl,
}: NewProductEmailProps) => (
  <Html>
    <Head />
    <Preview>¡Nuevo producto en la tienda!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>¡Tenemos un nuevo producto que te va a encantar!</Heading>
        
        <Link
          href={productUrl}
          target="_blank"
          style={{
            display: 'block',
            width: '100%',
          }}
        >
          <Img
            src={productImage}
            alt={productName}
            width="100%"
            style={productImageStyle}
          />
        </Link>

        <Heading as="h2" style={h2}>{productName}</Heading>
        
        <Text style={text}>{productDescription}</Text>
        
        <Link
          href={productUrl}
          style={button}
        >
          Ver producto
        </Link>

        <Text style={footer}>
          {new Date().getFullYear()} - Tu Tienda Online
        </Text>
      </Container>
    </Body>
  </Html>
);

export default NewProductEmail;

const main = {
  backgroundColor: '#f6f9fc',
  padding: '10px 0',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  padding: '45px',
};

const h1 = {
  color: '#003049',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
};

const h2 = {
    color: '#003049',
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '30px 0',
    padding: '0',
  };

const text = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '16px',
  margin: '30px 0',
};

const productImageStyle = {
    borderRadius: '5px',
    margin: '20px 0',
  };

const button = {
    backgroundColor: '#3b82f6',
    borderRadius: '5px',
    color: '#fff',
    fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
    fontSize: '15px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    width: '210px',
    padding: '14px 7px',
  };

const footer = {
  color: '#666',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '12px',
  lineHeight: '24px',
  marginTop: '30px',
};
