import React from "react";
import styled from "styled-components";

const Section = styled.section`
  padding: 10rem 10rem;
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

const MainDescription = styled.p`
  font-size: 1.125rem;
  color: #4b5563;
  max-width: 768px;
  margin: 0 auto;
`;

const GridContainer = styled.div`
  display: grid;
  gap: 3rem;
  align-items: center;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const LeftColumn = styled.div``;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1.5rem;
`;

const Description = styled.p`
  color: #4b5563;
  margin-bottom: 1.5rem;
`;

const CertificationContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const CertificationBadge = styled.span`
  background-color: #dbeafe;
  color: #1d4ed8;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const RightColumn = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  border: 1px solid #93c5fd;
  padding: 3rem 5rem 3rem 3rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
`;

const FeatureList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 350px;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const FeatureIcon = styled.span`
  font-size: 1.5rem;
`;

const FeatureContent = styled.div``;

const FeatureTitle = styled.h4`
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
`;

const FeatureDescription = styled.p`
  color: #4b5563;
  font-size: 0.875rem;
`;

const AboutHomePage = () => {
  return (
    <Section>
      <Container>
        <HeaderSection>
          <MainTitle>Quản lý phân tích huyết học là gì?</MainTitle>
          <MainDescription>
            Quản lý phân tích huyết học là quy trình toàn diện từ tiếp nhận mẫu
            đến trả kết quả, đảm bảo chất lượng và độ chính xác cao nhất.
          </MainDescription>
        </HeaderSection>

        <GridContainer>
          {/* Left Column */}
          <LeftColumn>
            <SectionTitle>
              Giải pháp toàn diện cho phòng lab hiện đại
            </SectionTitle>
            <Description>
              Hệ thống tích hợp đầy đủ các chức năng cần thiết cho việc quản lý
              phòng thí nghiệm huyết học, từ quản lý bệnh nhân, mẫu bệnh phẩm
              đến tự động hóa quy trình xét nghiệm.
            </Description>
            <Description>
              Với công nghệ tiên tiến và giao diện thân thiện, hệ thống giúp
              tăng hiệu quả làm việc và giảm thiểu sai sót trong quá trình xét
              nghiệm.
            </Description>

            {/* Certification badges */}
            <CertificationContainer>
              {[
                "ISO 9001",
                "CAP Certified",
                "CLIA Compliant",
                "HIPAA Secure",
              ].map((cert) => (
                <CertificationBadge key={cert}>{cert}</CertificationBadge>
              ))}
            </CertificationContainer>
          </LeftColumn>

          {/* Right Column */}
          <RightColumn>
            <FeatureList>
              {[
                {
                  icon: "🧪",
                  title: "Quản lý xét nghiệm",
                  desc: "Theo dõi và quản lý toàn bộ vòng đời mẫu",
                },
                {
                  icon: "📊",
                  title: "Phân tích dữ liệu",
                  desc: "Tối ưu hóa và chuẩn hóa các bước xét nghiệm",
                },
                {
                  icon: "🔍",
                  title: "Kiểm soát chất lượng",
                  desc: "Kết nối với các thiết bị phân tích hiện đại",
                },
                {
                  icon: "👥",
                  title: "Cộng đồng chuyên gia",
                  desc: "Tạo báo cáo chi tiết và phân tích xu hướng",
                },
              ].map((item, index) => (
                <FeatureItem key={index}>
                  <FeatureIcon>{item.icon}</FeatureIcon>
                  <FeatureContent>
                    <FeatureTitle>{item.title}</FeatureTitle>
                    <FeatureDescription>{item.desc}</FeatureDescription>
                  </FeatureContent>
                </FeatureItem>
              ))}
            </FeatureList>
          </RightColumn>
        </GridContainer>
      </Container>
    </Section>
  );
};

export default AboutHomePage;
