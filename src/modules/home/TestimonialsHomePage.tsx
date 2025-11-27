import React from "react";
import styled from "styled-components";
import { useTranslation, Trans } from "react-i18next";

const Section = styled.section`
  padding: 5rem 0;
  background-color: #f9fafb;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const MainTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const GridContainer = styled.div`
  display: grid;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const TestimonialCard = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  box-shadow: 0 4px 6px 5px rgba(0, 0, 0, 0.05);
`;

const StarsContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

const Star = styled.span`
  color: #fbbf24;
  font-size: 1.125rem;
`;

const Quote = styled.p`
  color: #4b5563;
  margin-bottom: 1rem;
  font-style: italic;
`;

const AuthorContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background-color: #dbeafe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
`;

const AvatarText = styled.span`
  color: #2563eb;
  font-weight: 600;
`;

const AuthorInfo = styled.div``;

const AuthorName = styled.p`
  font-weight: 600;
  color: #1f2937;
`;

const AuthorRole = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
`;
const BlueSpan = styled.span`
  color: #2563eb;
`;

const TestimonialsHomePage = () => {
  const { t } = useTranslation("home");
  const testimonials = t("testimonials.items", {
    returnObjects: true,
  }) as { name: string; role: string; quote: string }[];

  return (
    <Section>
      <Container>
        <HeaderSection>
          <MainTitle>
            <Trans
              i18nKey="home:testimonials.title"
              components={{ highlight: <BlueSpan /> }}
            />
          </MainTitle>
        </HeaderSection>

        <GridContainer>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index}>
              <StarsContainer>
                {[...Array(5)].map((_, i) => (
                  <Star key={i}>★</Star>
                ))}
              </StarsContainer>
              <Quote>"{testimonial.quote}"</Quote>
              <AuthorContainer>
                <Avatar>
                  <AvatarText>{testimonial.name.charAt(0)}</AvatarText>
                </Avatar>
                <AuthorInfo>
                  <AuthorName>{testimonial.name}</AuthorName>
                  <AuthorRole>{testimonial.role}</AuthorRole>
                </AuthorInfo>
              </AuthorContainer>
            </TestimonialCard>
          ))}
        </GridContainer>
      </Container>
    </Section>
  );
};

export default TestimonialsHomePage;
