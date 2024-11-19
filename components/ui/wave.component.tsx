import { View, StyleSheet } from "react-native";
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Path,
  G,
  Rect,
} from "react-native-svg";
import { Colors } from "@/constants";

export const WaveBackground = () => {
  return (
    <View style={{ position: "absolute", width: "100%", height: "100%" }}>
      {/* Gradiente de fondo base */}
      <View style={{ position: "absolute", width: "100%", height: "100%" }}>
        <Svg height="100%" width="100%" style={{ position: "absolute" }}>
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={Colors.white_10} stopOpacity="1" />
              <Stop offset="1" stopColor={Colors.white_20} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />

          {/* Patrón geométrico */}
          <G opacity="0.05">
            {/* Líneas diagonales */}
            <Path
              d="M0 0L100 100M50 0L150 100M100 0L200 100M150 0L250 100M200 0L300 100"
              stroke={Colors.blue_60}
              strokeWidth="0.5"
            />

            {/* Puntos decorativos */}
            <G fill={Colors.white_80}>
              <Circle cx="50" cy="50" r="2" />
              <Circle cx="150" cy="100" r="2" />
              <Circle cx="250" cy="150" r="2" />
              <Circle cx="100" cy="200" r="2" />
              <Circle cx="200" cy="250" r="2" />
            </G>
          </G>
        </Svg>
      </View>

      {/* Overlay con efecto de profundidad */}
      <Svg
        style={{ position: "absolute", bottom: 0 }}
        width="100%"
        height="60%"
        preserveAspectRatio="none"
      >
        <Defs>
          <LinearGradient id="overlay" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={Colors.white_20} stopOpacity="0" />
            <Stop offset="1" stopColor={Colors.white_30} stopOpacity="0.3" />
          </LinearGradient>
        </Defs>
        <Path
          d="M0 100 C150 50, 300 150, 450 100 L450 600 L0 600 Z"
          fill="url(#overlay)"
        />
      </Svg>

      {/* Grid sutil */}
      <View style={styles.designElements}>
        <Svg height="100%" width="100%" opacity={0.03}>
          <G>
            {Array.from({ length: 10 }).map((_, i) => (
              <Path
                key={`grid-h-${i}`}
                d={`M0 ${i * 40} H400`}
                stroke={Colors.white_90}
                strokeWidth="0.5"
              />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <Path
                key={`grid-v-${i}`}
                d={`M${i * 40} 0 V400`}
                stroke={Colors.white_90}
                strokeWidth="0.5"
              />
            ))}
          </G>
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  designElements: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});

// Componente auxiliar para los círculos
const Circle = ({ cx, cy, r, ...props }: any) => (
  <Path
    d={`M${cx - r},${cy} a${r},${r} 0 1,0 ${r * 2},0 a${r},${r} 0 1,0 -${r * 2},0`}
    {...props}
  />
);
