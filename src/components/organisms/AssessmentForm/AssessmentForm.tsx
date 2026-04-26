import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { useThemeColor } from '../../../hooks/useThemeColor';
import { Assessment } from '../../../types/assessment';
import { Input, Text } from '../../atoms';
import { FeedbackPanel } from '../../molecules/FeedbackPanel';
import { PhotoSection } from '../../molecules/PhotoSection';

// SVG icon paths from HTML
const SVG_CHECK = "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z";
const SVG_WARNING = "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z";
const SVG_INFO = "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z";
const SVG_INFO_OBS = "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z";
const SVG_PERSON = "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z";

type AssessmentFormProps = {
  assessment: Assessment;
  onUpdate: (key: string, value: string) => void;
};

export function AssessmentForm({ assessment, onUpdate }: AssessmentFormProps) {
  const bg2 = useThemeColor({}, 'backgroundSecondary');
  const bg3 = useThemeColor({}, 'backgroundTertiary');
  const borderGold = useThemeColor({}, 'borderGold');
  const border = useThemeColor({}, 'border');
  const text = useThemeColor({}, 'text');
  const text3 = '#6a5a40';
  const gold = useThemeColor({}, 'gold');

  const feedbackPanelData = {
    positiveItems: [
      { value: assessment?.positivo_1 || '', placeholder: 'Ponto positivo 1', onChangeText: (t: string) => onUpdate('positivo_1', t) },
      { value: assessment?.positivo_2 || '', placeholder: 'Ponto positivo 2', onChangeText: (t: string) => onUpdate('positivo_2', t) },
      { value: assessment?.positivo_3 || '', placeholder: 'Ponto positivo 3', onChangeText: (t: string) => onUpdate('positivo_3', t) },
      { value: assessment?.positivo_4 || '', placeholder: 'Ponto positivo 4', onChangeText: (t: string) => onUpdate('positivo_4', t) },
    ],
    adjustmentItems: [
      { value: assessment?.ajuste_1 || '', placeholder: 'Ajuste 1', onChangeText: (t: string) => onUpdate('ajuste_1', t) },
      { value: assessment?.ajuste_2 || '', placeholder: 'Ajuste 2', onChangeText: (t: string) => onUpdate('ajuste_2', t) },
      { value: assessment?.ajuste_3 || '', placeholder: 'Ajuste 3', onChangeText: (t: string) => onUpdate('ajuste_3', t) },
      { value: assessment?.ajuste_4 || '', placeholder: 'Ajuste 4', onChangeText: (t: string) => onUpdate('ajuste_4', t) },
    ],
  };

  return (
    <View style={[styles.container, { backgroundColor: bg2 }]}>
      {/* Template Header */}
      <View style={[
        styles.header, 
        { 
          borderBottomColor: borderGold,
          // @ts-ignore - Web-specific gradient
          backgroundImage: 'linear-gradient(180deg, #1a1408 0%, #181818 100%)',
        }
      ]}>
        <Text style={[styles.headerTitle, { color: text }]}>
          ACOMPANHAMENTO <Text style={{ color: gold }}>FÍSICO</Text>
        </Text>
        <Text style={[styles.headerSubtitle, { color: text3 }]}>
          EVOLUÇÃO{'\u00A0\u00A0'}|{'\u00A0\u00A0'}DISCIPLINA{'\u00A0\u00A0'}|{'\u00A0\u00A0'}CONSISTÊNCIA
        </Text>
      </View>

      {/* Photo Sections (Frente + Costas) — SectionLabels are inside PhotoSection */}
      <PhotoSection
        onPhotoSelected={(key, uri) => onUpdate(key, uri)}
        onRemovePhoto={(key) => onUpdate(key, '')}
        onFieldChange={onUpdate}
        assessmentData={assessment}
      />

      {/* Feedback Panels - 2 columns */}
      <View style={[styles.feedbackGrid, { borderTopColor: borderGold }]}>
        <View style={[styles.feedbackColumn, { borderRightColor: border }]}>
          <FeedbackPanel 
            title="Pontos" 
            highlightedTitle="Positivos" 
            svgPath={SVG_CHECK}
            dotColor="green" 
            items={feedbackPanelData.positiveItems}
          />
        </View>
        <View style={styles.feedbackColumn}>
          <FeedbackPanel 
            title="Próximos" 
            highlightedTitle="Ajustes" 
            svgPath={SVG_INFO}
            dotColor="red" 
            items={feedbackPanelData.adjustmentItems}
          />
        </View>
      </View>

      {/* Observations & Meta Info */}
      <View style={[styles.bottomInfo, { borderTopColor: borderGold }]}>
        {/* Observations */}
        <View style={[styles.obsSection, { borderRightColor: borderGold }]}>
          <View style={styles.sectionMiniTitle}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill={gold}>
              <Path d={SVG_INFO_OBS} />
            </Svg>
            <Text style={styles.miniTitleText}>
              Observações <Text style={{ color: gold }}>Gerais</Text>
            </Text>
          </View>
          <Input
            variant="boxed"
            placeholder="Anotações gerais sobre a avaliação..."
            value={assessment?.observacoes || ''}
            onChangeText={(t) => onUpdate('observacoes', t)}
            multiline
            numberOfLines={4}
            containerStyle={styles.textareaContainer}
            style={[styles.textarea, { borderColor: border, backgroundColor: bg3, color: text }]}
          />
        </View>

        {/* Meta */}
        <View style={[styles.metaSection, { backgroundColor: '#1a1408' }]}>
          <View style={styles.sectionMiniTitle}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill={gold}>
              <Path d={SVG_PERSON} />
            </Svg>
            <Text style={styles.miniTitleText}>
              Próxima <Text style={{ color: gold }}>Meta</Text>
            </Text>
          </View>
          <Input
            variant="boxed"
            placeholder="Meta para o próximo período..."
            value={assessment?.proxima_meta || ''}
            onChangeText={(t) => onUpdate('proxima_meta', t)}
            multiline
            numberOfLines={4}
            containerStyle={styles.textareaContainer}
            style={[styles.textareaMeta, { borderColor: borderGold, backgroundColor: '#120f05', color: text }]}
          />
        </View>
      </View>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: bg3, borderTopColor: borderGold }]}>
        <Text style={[styles.footerName, { color: text }]}>
          Personal <Text style={{ color: gold }}>Caio Oliver</Text>
        </Text>
        <Text style={[styles.footerTagline, { color: text3 }]}>
          Consistência é o que <Text style={{ color: gold }}>transforma.</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 3,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 11,
    letterSpacing: 3,
    marginTop: 4,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  feedbackGrid: {
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  feedbackColumn: {
    flex: 1,
    borderRightWidth: 1,
  },
  bottomInfo: {
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  obsSection: {
    flex: 3,
    padding: 14,
    paddingHorizontal: 16,
    borderRightWidth: 1,
  },
  metaSection: {
    flex: 2,
    padding: 14,
    paddingHorizontal: 16,
  },
  sectionMiniTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  miniTitleText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  textareaContainer: {
    marginBottom: 0,
  },
  textarea: {
    minHeight: 60,
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontFamily: 'System',
    fontSize: 12,
  },
  textareaMeta: {
    minHeight: 70,
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontFamily: 'System',
    fontSize: 12,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  footerName: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  footerTagline: {
    fontSize: 10,
    letterSpacing: 2,
    marginTop: 4,
    textTransform: 'uppercase',
  },
});
