import React from "react";
import styled from "styled-components";

const Section = styled.section`
  padding: 5rem 0;
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

const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const StepItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 2rem;
  position: relative;

  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const StepNumber = styled.div`
  width: 4rem;
  height: 4rem;
  background-color: #2563eb;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const StepIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
`;

const StepTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const StepDescription = styled.p`
  color: #4b5563;
  font-size: 0.875rem;
  max-width: 20rem;
`;

const Arrow = styled.div`
  display: none;
  position: absolute;
  top: 2rem;
  left: 100%;
  width: 4rem;
  height: 0.125rem;
  background-color: #2563eb;
  transform: translateX(2rem);

  @media (min-width: 768px) {
    display: block;
  }

  &::after {
    content: "";
    position: absolute;
    right: 0;
    top: 50%;
    width: 0;
    height: 0;
    border-left: 1rem solid #2563eb;
    border-top: 0.5rem solid transparent;
    border-bottom: 0.5rem solid transparent;
    transform: translateX(0.25rem) translateY(-50%);
  }
`;

const WorkHomePage = () => {
  return (
    <Section>
      <Container>
        <HeaderSection>
          <MainTitle>Cách thức hoạt động</MainTitle>
        </HeaderSection>

        <StepsContainer>
          {[
            {
              step: "01",
              icon: "👥",
              title: "Đăng ký tài khoản",
              desc: "Tạo tài khoản và xác thực thông tin",
            },
            {
              step: "02",
              icon: "⚙️",
              title: "Cấu hình hệ thống",
              desc: "Thiết lập các thông số và quy trình",
            },
            {
              step: "03",
              icon: "🚀",
              title: "Bắt đầu sử dụng",
              desc: "Khởi động và làm quen với hệ thống",
            },
            {
              step: "04",
              icon: "📊",
              title: "Phân tích & Báo cáo",
              desc: "Theo dõi và tạo báo cáo chi tiết",
            },
          ].map((item, index) => (
            <StepItem key={index}>
              <StepNumber>{item.step}</StepNumber>
              <StepIcon>{item.icon}</StepIcon>
              <StepTitle>{item.title}</StepTitle>
              <StepDescription>{item.desc}</StepDescription>

              {/* Arrow */}
              {index < 3 && <Arrow />}
            </StepItem>
          ))}
        </StepsContainer>
      </Container>
    </Section>
  );
};

export default WorkHomePage;
