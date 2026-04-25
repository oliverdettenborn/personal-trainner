import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemeColor } from '../../../hooks/useThemeColor';
import { Assessment } from '../../../types/assessment';
import { Input, Text } from '../../atoms';
import { FeedbackPanel } from '../../molecules/FeedbackPanel';
import { PhotoSection } from '../../molecules/PhotoSection';

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

  const photoSectionProps = {
    labelFrenteAntes: "Frente Antes",
    labelFrenteDepois: "Frente Depois",
    labelCostasAntes: "Costas Antes",
    labelCostasDepois: "Costas Depois",
    onPhotoSelected: (key: string, uri: string) => onUpdate(key, uri),
    onRemovePhoto: (key: string) => onUpdate(key, ''),
    assessmentData: assessment,
  };

  const feedbackPanelData = {
    positiveItems: [
      { value: assessment?.positivo_1 || '', placeholder: 'Ponto positivo 1', onChangeText: (text: string) => onUpdate('positivo_1', text) },
      { value: assessment?.positivo_2 || '', placeholder: 'Ponto positivo 2', onChangeText: (text: string) => onUpdate('positivo_2', text) },
      { value: assessment?.positivo_3 || '', placeholder: 'Ponto positivo 3', onChangeText: (text: string) => onUpdate('positivo_3', text) },
      { value: assessment?.positivo_4 || '', placeholder: 'Ponto positivo 4', onChangeText: (text: string) => onUpdate('positivo_4', text) },
    ],
    improveItems: [
      { value: assessment?.melhorar_1 || '', placeholder: 'Ponto a melhorar 1', onChangeText: (text: string) => onUpdate('melhorar_1', text) },
      { value: assessment?.melhorar_2 || '', placeholder: 'Ponto a melhorar 2', onChangeText: (text: string) => onUpdate('melhorar_2', text) },
      { value: assessment?.melhorar_3 || '', placeholder: 'Ponto a melhorar 3', onChangeText: (text: string) => onUpdate('melhorar_3', text) },
      { value: assessment?.melhorar_4 || '', placeholder: 'Ponto a melhorar 4', onChangeText: (text: string) => onUpdate('melhorar_4', text) },
    ],
    adjustmentItems: [
      { value: assessment?.ajuste_1 || '', placeholder: 'Ajuste 1', onChangeText: (text: string) => onUpdate('ajuste_1', text) },
      { value: assessment?.ajuste_2 || '', placeholder: 'Ajuste 2', onChangeText: (text: string) => onUpdate('ajuste_2', text) },
      { value: assessment?.ajuste_3 || '', placeholder: 'Ajuste 3', onChangeText: (text: string) => onUpdate('ajuste_3', text) },
      { value: assessment?.ajuste_4 || '', placeholder: 'Ajuste 4', onChangeText: (text: string) => onUpdate('ajuste_4', text) },
    ],
  };

  return (
    <View style={[styles.container, { backgroundColor: bg2 }]}>
      {/* Header */}
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
          EVOLUÇÃO  |  DISCIPLINA  |  CONSISTÊNCIA
        </Text>
      </View>

      {/* Photo Section */}
      <View style={[styles.section, { borderBottomColor: borderGold }]}>
        <View style={[styles.sectionLabel, { backgroundColor: bg3, borderColor: borderGold }]}>
          <Text style={[styles.sectionLabelText, { color: gold }]}>FOTOS</Text>
        </View>
        <PhotoSection {...photoSectionProps} />
      </View>

      {/* Feedback Panels - 3 columns */}
      <View style={[styles.section, { borderBottomColor: borderGold }]}>
        <View style={[styles.feedbackGrid]}>
          <View style={styles.feedbackColumn}>
            <FeedbackPanel 
              title="Pontos" 
              highlightedTitle="Positivos" 
              icon="checkmark-circle" 
              dotColor="green" 
              items={feedbackPanelData.positiveItems}
            />
          </View>
          <View style={[styles.feedbackColumn, { borderLeftColor: border, borderRightColor: border }]}>
            <FeedbackPanel 
              title="Pontos a" 
              highlightedTitle="Melhorar" 
              icon="alert-circle" 
              dotColor="amber" 
              items={feedbackPanelData.improveItems}
            />
          </View>
          <View style={styles.feedbackColumn}>
            <FeedbackPanel 
              title="Próximos" 
              highlightedTitle="Ajustes" 
              icon="alert-circle-outline" 
              dotColor="red" 
              items={feedbackPanelData.adjustmentItems}
            />
          </View>
        </View>
      </View>

      {/* Observations & Meta Info */}
      <View style={[styles.section, { borderBottomColor: borderGold }]}>
        <View style={[styles.observationsRow]}>
          {/* Observations */}
          <View style={styles.observationsCol}>
            <Text style={[styles.sectionMiniTitle, { color: gold }]}>
              📝 <Text>OBSERVAÇÕES GERAIS</Text>
            </Text>
            <Input
              variant="boxed"
              placeholder="Notas sobre a avaliação..."
              value={assessment?.observacoes || ''}
              onChangeText={(text) => onUpdate('observacoes', text)}
              multiline
              numberOfLines={4}
              containerStyle={styles.textareaContainer}
              style={[styles.textarea, { borderColor: borderGold, backgroundColor: bg3, color: text }]}
            />
          </View>

          {/* Meta Info */}
          <View style={[styles.metaCol, { borderLeftColor: borderGold, backgroundColor: '#1a1408' }]}>
            <Text style={[styles.sectionMiniTitle, { color: gold }]}>
              📅 <Text>PRÓXIMA META</Text>
            </Text>
            <Input
              variant="boxed"
              placeholder="Próxima meta..."
              value={assessment?.proxima_meta || ''}
              onChangeText={(text) => onUpdate('proxima_meta', text)}
              multiline
              numberOfLines={4}
              containerStyle={styles.textareaContainer}
              style={[styles.textarea, { borderColor: borderGold, backgroundColor: bg3, color: text }]}
            />
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: bg3 }]}>
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
    backgroundColor: '#181818',
    overflow: 'hidden',
  },
  header: {
    textAlign: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#e8e0d0',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  headerSubtitle: {
    fontSize: 11,
    letterSpacing: 3,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  section: {
    borderBottomWidth: 1,
  },
  sectionLabel: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  sectionLabelText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  feedbackGrid: {
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  feedbackColumn: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderLeftWidth: 0,
    borderRightWidth: 1,
  },
  observationsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  observationsCol: {
    flex: 3,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRightWidth: 1,
  },
  metaCol: {
    flex: 2,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderLeftWidth: 1,
  },
  sectionMiniTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  textareaContainer: {
    marginBottom: 0,
  },
  textarea: {
    minHeight: 70,
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontFamily: 'System',
  },
  footer: {
    textAlign: 'center',
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
