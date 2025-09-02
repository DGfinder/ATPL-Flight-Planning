import React, { useState } from 'react';
import { Card, CardHeader, CardContent, SecondaryButton, useDesignSystem } from '../../design-system';
import { Fuel } from 'lucide-react';

interface FuelPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalTripFuel: number;
  flightPlanSegments?: any[];
}

interface FuelBreakdown {
  fuelBurn: number;
  variableReserves: number;
  fixedReserves: number;
  weatherHolding: number;
  trafficHolding: number;
  wipHolding: number;
  taxiIn: number;
  taxiOut: number;
}

interface AbnormalOperations {
  depressurised: FuelBreakdown;
  oneEngineInoperative: FuelBreakdown;
}

const FuelPolicyModal: React.FC<FuelPolicyModalProps> = ({ isOpen, onClose, totalTripFuel, flightPlanSegments = [] }) => {
  const { colors, spacing, styles } = useDesignSystem();
  const [fuelBreakdown, setFuelBreakdown] = useState<FuelBreakdown>({
    fuelBurn: totalTripFuel,
    variableReserves: 0, // Student must calculate
    fixedReserves: 0, // Student must enter
    weatherHolding: 0, // Student must calculate
    trafficHolding: 0, // Student must calculate
    wipHolding: 0, // Student must calculate
    taxiIn: 0,
    taxiOut: 0
  });
  const [showAbnormalOps, setShowAbnormalOps] = useState(false);
  const [abnormalOperations, setAbnormalOperations] = useState<AbnormalOperations>({
    depressurised: {
      fuelBurn: totalTripFuel,
      variableReserves: 0,
      fixedReserves: 0,
      weatherHolding: 0,
      trafficHolding: 0,
      wipHolding: 0,
      taxiIn: 0,
      taxiOut: 0
    },
    oneEngineInoperative: {
      fuelBurn: totalTripFuel,
      variableReserves: 0,
      fixedReserves: 0,
      weatherHolding: 0,
      trafficHolding: 0,
      wipHolding: 0,
      taxiIn: 0,
      taxiOut: 0
    }
  });

  const totalFuelRequired = Object.values(fuelBreakdown).reduce((sum, value) => sum + value, 0);

  const handleInputChange = (field: keyof FuelBreakdown, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFuelBreakdown(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const handleAbnormalInputChange = (operation: keyof AbnormalOperations, field: keyof FuelBreakdown, value: string) => {
    const numValue = parseFloat(value) || 0;
    setAbnormalOperations(prev => ({
      ...prev,
      [operation]: {
        ...prev[operation],
        [field]: numValue
      }
    }));
  };

  const getTotalFuelForOperation = (operation: FuelBreakdown) => {
    return Object.values(operation).reduce((sum, value) => sum + value, 0);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
                        <Card style={{
        maxWidth: showAbnormalOps ? '900px' : '600px',
        width: '90vw',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
                 <CardHeader>
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: spacing.scale[2] }}>
               <Fuel style={{ width: '1.25rem', height: '1.25rem', color: colors.aviation.primary }} />
               <h3 style={{ ...styles.heading, fontSize: '1.25rem', margin: 0 }}>
                 Fuel Policy Calculator
               </h3>
             </div>
             <SecondaryButton
               onClick={() => setShowAbnormalOps(!showAbnormalOps)}
               style={{ fontSize: '0.75rem', padding: `${spacing.scale[1]} ${spacing.scale[2]}` }}
             >
               {showAbnormalOps ? 'Hide Abnormal Ops' : 'Show Abnormal Ops'}
             </SecondaryButton>
           </div>
         </CardHeader>
        
                 <CardContent style={{ flex: 1, overflow: 'auto' }}>
           
            {/* Zone Fuel Breakdown from Flight Plan */}
            {flightPlanSegments.length > 0 && (
              <div style={{
                marginBottom: spacing.scale[4],
                padding: spacing.scale[3],
                background: colors.withOpacity(colors.aviation.secondary, 0.05),
                borderRadius: spacing.radius.md,
                border: `1px solid ${colors.withOpacity(colors.aviation.secondary, 0.1)}`
              }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: colors.aviation.navy, marginBottom: spacing.scale[2] }}>
                  Zone Fuel Breakdown (from Flight Plan)
                </h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: spacing.scale[2],
                  fontSize: '0.75rem'
                }}>
                  <div style={{ fontWeight: 600, color: colors.aviation.navy }}>Segment</div>
                  <div style={{ fontWeight: 600, color: colors.aviation.navy, textAlign: 'right' }}>Zone Fuel (kg)</div>
                  <div style={{ fontWeight: 600, color: colors.aviation.navy, textAlign: 'right' }}>Cumulative</div>
                  {flightPlanSegments.map((segment: any, index: number) => (
                    <React.Fragment key={segment.id}>
                      <div style={{ color: colors.aviation.muted }}>{segment.segment || `Seg ${index + 1}`}</div>
                      <div style={{ textAlign: 'right', color: colors.aviation.navy }}>
                        {segment.zoneFuel > 0 ? segment.zoneFuel.toFixed(0) : '-'}
                      </div>
                      <div style={{ textAlign: 'right', color: colors.aviation.primary, fontWeight: 600 }}>
                        {flightPlanSegments
                          .slice(0, index + 1)
                          .reduce((sum: number, seg: any) => sum + (seg.zoneFuel || 0), 0)
                          .toFixed(0)}
                      </div>
                    </React.Fragment>
                  ))}
                  <div style={{ 
                    fontWeight: 600, 
                    color: colors.aviation.primary,
                    borderTop: `1px solid ${colors.gray[200]}`,
                    paddingTop: spacing.scale[1]
                  }}>
                    Total Trip Fuel
                  </div>
                  <div style={{ 
                    textAlign: 'right',
                    fontWeight: 600, 
                    color: colors.aviation.primary,
                    borderTop: `1px solid ${colors.gray[200]}`,
                    paddingTop: spacing.scale[1]
                  }}>
                    {totalTripFuel.toFixed(0)} kg
                  </div>
                  <div style={{ 
                    textAlign: 'right',
                    fontWeight: 600, 
                    color: colors.aviation.primary,
                    borderTop: `1px solid ${colors.gray[200]}`,
                    paddingTop: spacing.scale[1]
                  }}>
                    {totalTripFuel.toFixed(0)} kg
                  </div>
                </div>
              </div>
            )}

                                             {showAbnormalOps && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 150px 150px 150px',
                gap: spacing.scale[3],
                marginBottom: spacing.scale[2],
                padding: spacing.scale[2],
                background: colors.gray[100],
                borderRadius: spacing.radius.md,
                fontSize: '0.75rem',
                fontWeight: 600,
                color: colors.aviation.navy,
                textAlign: 'center'
              }}>
                <span>Fuel Component</span>
                <span>Normal</span>
                <span>Depressurised</span>
                <span>One Engine Inop</span>
              </div>
            )}
            <div style={{ 
              display: 'grid', 
              gap: spacing.scale[3],
              gridTemplateColumns: showAbnormalOps ? '1fr 150px 150px 150px' : '1fr 150px'
            }}>
             <div style={{
               display: 'contents'
             }}>
               <div style={{
                 padding: spacing.scale[2],
                 background: colors.gray[50],
                 borderRadius: spacing.radius.md,
                 display: 'flex',
                 alignItems: 'center',
                 fontWeight: 600,
                 color: colors.aviation.navy,
                 fontSize: '0.875rem'
               }}>
                 Trip Fuel Burn (from flight plan)
               </div>
               <input
                 type="number"
                 value={fuelBreakdown.fuelBurn}
                 onChange={(e) => handleInputChange('fuelBurn', e.target.value)}
                 style={{
                   padding: spacing.scale[2],
                   border: `1px solid ${colors.gray[300]}`,
                   borderRadius: spacing.radius.sm,
                   fontSize: '0.875rem',
                   textAlign: 'right'
                 }}
                 placeholder="Enter"
               />
               {showAbnormalOps && (
                 <>
                   <input
                     type="number"
                     value={abnormalOperations.depressurised.fuelBurn}
                     onChange={(e) => handleAbnormalInputChange('depressurised', 'fuelBurn', e.target.value)}
                     style={{
                       padding: spacing.scale[2],
                       border: `1px solid ${colors.gray[300]}`,
                       borderRadius: spacing.radius.sm,
                       fontSize: '0.875rem',
                       textAlign: 'right'
                     }}
                     placeholder="DP"
                   />
                   <input
                     type="number"
                     value={abnormalOperations.oneEngineInoperative.fuelBurn}
                     onChange={(e) => handleAbnormalInputChange('oneEngineInoperative', 'fuelBurn', e.target.value)}
                     style={{
                       padding: spacing.scale[2],
                       border: `1px solid ${colors.gray[300]}`,
                       borderRadius: spacing.radius.sm,
                       fontSize: '0.875rem',
                       textAlign: 'right'
                     }}
                     placeholder="OEI"
                   />
                 </>
               )}
             </div>

                         <div style={{
               display: 'contents'
             }}>
               <div style={{
                 padding: spacing.scale[2],
                 background: colors.gray[50],
                 borderRadius: spacing.radius.md,
                 display: 'flex',
                 alignItems: 'center',
                 fontWeight: 600,
                 color: colors.aviation.navy,
                 fontSize: '0.875rem'
               }}>
                 Variable Reserves (calculate %)
               </div>
               <input
                 type="number"
                 value={fuelBreakdown.variableReserves}
                 onChange={(e) => handleInputChange('variableReserves', e.target.value)}
                 style={{
                   padding: spacing.scale[2],
                   border: `1px solid ${colors.gray[300]}`,
                   borderRadius: spacing.radius.sm,
                   fontSize: '0.875rem',
                   textAlign: 'right'
                 }}
                 placeholder="Calculate"
               />
               {showAbnormalOps && (
                 <>
                   <input
                     type="number"
                     value={abnormalOperations.depressurised.variableReserves}
                     onChange={(e) => handleAbnormalInputChange('depressurised', 'variableReserves', e.target.value)}
                     style={{
                       padding: spacing.scale[2],
                       border: `1px solid ${colors.gray[300]}`,
                       borderRadius: spacing.radius.sm,
                       fontSize: '0.875rem',
                       textAlign: 'right'
                     }}
                     placeholder="DP"
                   />
                   <input
                     type="number"
                     value={abnormalOperations.oneEngineInoperative.variableReserves}
                     onChange={(e) => handleAbnormalInputChange('oneEngineInoperative', 'variableReserves', e.target.value)}
                     style={{
                       padding: spacing.scale[2],
                       border: `1px solid ${colors.gray[300]}`,
                       borderRadius: spacing.radius.sm,
                       fontSize: '0.875rem',
                       textAlign: 'right'
                     }}
                     placeholder="OEI"
                   />
                 </>
               )}
             </div>

                                      <div style={{
               display: 'contents'
             }}>
               <div style={{
                 padding: spacing.scale[2],
                 background: colors.gray[50],
                 borderRadius: spacing.radius.md,
                 display: 'flex',
                 alignItems: 'center',
                 fontWeight: 600,
                 color: colors.aviation.navy,
                 fontSize: '0.875rem'
               }}>
                 Fixed Reserves (kg)
               </div>
               <input
                 type="number"
                 value={fuelBreakdown.fixedReserves}
                 onChange={(e) => handleInputChange('fixedReserves', e.target.value)}
                 style={{
                   padding: spacing.scale[2],
                   border: `1px solid ${colors.gray[300]}`,
                   borderRadius: spacing.radius.sm,
                   fontSize: '0.875rem',
                   textAlign: 'right'
                 }}
                 placeholder="Enter"
               />
               {showAbnormalOps && (
                 <>
                   <input
                     type="number"
                     value={abnormalOperations.depressurised.fixedReserves}
                     onChange={(e) => handleAbnormalInputChange('depressurised', 'fixedReserves', e.target.value)}
                     style={{
                       padding: spacing.scale[2],
                       border: `1px solid ${colors.gray[300]}`,
                       borderRadius: spacing.radius.sm,
                       fontSize: '0.875rem',
                       textAlign: 'right'
                     }}
                     placeholder="DP"
                   />
                   <input
                     type="number"
                     value={abnormalOperations.oneEngineInoperative.fixedReserves}
                     onChange={(e) => handleAbnormalInputChange('oneEngineInoperative', 'fixedReserves', e.target.value)}
                     style={{
                       padding: spacing.scale[2],
                       border: `1px solid ${colors.gray[300]}`,
                       borderRadius: spacing.radius.sm,
                       fontSize: '0.875rem',
                       textAlign: 'right'
                     }}
                     placeholder="OEI"
                   />
                 </>
               )}
             </div>

                           <div style={{
                display: 'contents'
              }}>
                <div style={{
                  padding: spacing.scale[2],
                  background: colors.gray[50],
                  borderRadius: spacing.radius.md,
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 600,
                  color: colors.aviation.navy,
                  fontSize: '0.875rem'
                }}>
                  Weather Holding (calculate time)
                </div>
                <input
                  type="number"
                  value={fuelBreakdown.weatherHolding}
                  onChange={(e) => handleInputChange('weatherHolding', e.target.value)}
                  style={{
                    padding: spacing.scale[2],
                    border: `1px solid ${colors.gray[300]}`,
                    borderRadius: spacing.radius.sm,
                    fontSize: '0.875rem',
                    textAlign: 'right'
                  }}
                  placeholder="Calculate"
                />
                {showAbnormalOps && (
                  <>
                    <input
                      type="number"
                      value={abnormalOperations.depressurised.weatherHolding}
                      onChange={(e) => handleAbnormalInputChange('depressurised', 'weatherHolding', e.target.value)}
                      style={{
                        padding: spacing.scale[2],
                        border: `1px solid ${colors.gray[300]}`,
                        borderRadius: spacing.radius.sm,
                        fontSize: '0.875rem',
                        textAlign: 'right'
                      }}
                      placeholder="DP"
                    />
                    <input
                      type="number"
                      value={abnormalOperations.oneEngineInoperative.weatherHolding}
                      onChange={(e) => handleAbnormalInputChange('oneEngineInoperative', 'weatherHolding', e.target.value)}
                      style={{
                        padding: spacing.scale[2],
                        border: `1px solid ${colors.gray[300]}`,
                        borderRadius: spacing.radius.sm,
                        fontSize: '0.875rem',
                        textAlign: 'right'
                      }}
                      placeholder="OEI"
                    />
                  </>
                )}
              </div>

              <div style={{
                display: 'contents'
              }}>
                <div style={{
                  padding: spacing.scale[2],
                  background: colors.gray[50],
                  borderRadius: spacing.radius.md,
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 600,
                  color: colors.aviation.navy,
                  fontSize: '0.875rem'
                }}>
                  Traffic Holding (calculate time)
                </div>
                <input
                  type="number"
                  value={fuelBreakdown.trafficHolding}
                  onChange={(e) => handleInputChange('trafficHolding', e.target.value)}
                  style={{
                    padding: spacing.scale[2],
                    border: `1px solid ${colors.gray[300]}`,
                    borderRadius: spacing.radius.sm,
                    fontSize: '0.875rem',
                    textAlign: 'right'
                  }}
                  placeholder="Calculate"
                />
                {showAbnormalOps && (
                  <>
                    <input
                      type="number"
                      value={abnormalOperations.depressurised.trafficHolding}
                      onChange={(e) => handleAbnormalInputChange('depressurised', 'trafficHolding', e.target.value)}
                      style={{
                        padding: spacing.scale[2],
                        border: `1px solid ${colors.gray[300]}`,
                        borderRadius: spacing.radius.sm,
                        fontSize: '0.875rem',
                        textAlign: 'right'
                      }}
                      placeholder="DP"
                    />
                    <input
                      type="number"
                      value={abnormalOperations.oneEngineInoperative.trafficHolding}
                      onChange={(e) => handleAbnormalInputChange('oneEngineInoperative', 'trafficHolding', e.target.value)}
                      style={{
                        padding: spacing.scale[2],
                        border: `1px solid ${colors.gray[300]}`,
                        borderRadius: spacing.radius.sm,
                        fontSize: '0.875rem',
                        textAlign: 'right'
                      }}
                      placeholder="OEI"
                    />
                  </>
                )}
              </div>

              <div style={{
                display: 'contents'
              }}>
                <div style={{
                  padding: spacing.scale[2],
                  background: colors.gray[50],
                  borderRadius: spacing.radius.md,
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 600,
                  color: colors.aviation.navy,
                  fontSize: '0.875rem'
                }}>
                  WIP Holding (calculate time)
                </div>
                <input
                  type="number"
                  value={fuelBreakdown.wipHolding}
                  onChange={(e) => handleInputChange('wipHolding', e.target.value)}
                  style={{
                    padding: spacing.scale[2],
                    border: `1px solid ${colors.gray[300]}`,
                    borderRadius: spacing.radius.sm,
                    fontSize: '0.875rem',
                    textAlign: 'right'
                  }}
                  placeholder="Calculate"
                />
                {showAbnormalOps && (
                  <>
                    <input
                      type="number"
                      value={abnormalOperations.depressurised.wipHolding}
                      onChange={(e) => handleAbnormalInputChange('depressurised', 'wipHolding', e.target.value)}
                      style={{
                        padding: spacing.scale[2],
                        border: `1px solid ${colors.gray[300]}`,
                        borderRadius: spacing.radius.sm,
                        fontSize: '0.875rem',
                        textAlign: 'right'
                      }}
                      placeholder="DP"
                    />
                    <input
                      type="number"
                      value={abnormalOperations.oneEngineInoperative.wipHolding}
                      onChange={(e) => handleAbnormalInputChange('oneEngineInoperative', 'wipHolding', e.target.value)}
                      style={{
                        padding: spacing.scale[2],
                        border: `1px solid ${colors.gray[300]}`,
                        borderRadius: spacing.radius.sm,
                        fontSize: '0.875rem',
                        textAlign: 'right'
                      }}
                      placeholder="OEI"
                    />
                  </>
                )}
              </div>

             <div style={{
               display: 'contents'
             }}>
               <div style={{
                 padding: spacing.scale[2],
                 background: colors.gray[50],
                 borderRadius: spacing.radius.md,
                 display: 'flex',
                 alignItems: 'center',
                 fontWeight: 600,
                 color: colors.aviation.navy,
                 fontSize: '0.875rem'
               }}>
                 Taxi Out (kg)
               </div>
               <input
                 type="number"
                 value={fuelBreakdown.taxiOut}
                 onChange={(e) => handleInputChange('taxiOut', e.target.value)}
                 style={{
                   padding: spacing.scale[2],
                   border: `1px solid ${colors.gray[300]}`,
                   borderRadius: spacing.radius.sm,
                   fontSize: '0.875rem',
                   textAlign: 'right'
                 }}
                 placeholder="Enter"
               />
               {showAbnormalOps && (
                 <>
                   <input
                     type="number"
                     value={abnormalOperations.depressurised.taxiOut}
                     onChange={(e) => handleAbnormalInputChange('depressurised', 'taxiOut', e.target.value)}
                     style={{
                       padding: spacing.scale[2],
                       border: `1px solid ${colors.gray[300]}`,
                       borderRadius: spacing.radius.sm,
                       fontSize: '0.875rem',
                       textAlign: 'right'
                     }}
                     placeholder="DP"
                   />
                   <input
                     type="number"
                     value={abnormalOperations.oneEngineInoperative.taxiOut}
                     onChange={(e) => handleAbnormalInputChange('oneEngineInoperative', 'taxiOut', e.target.value)}
                     style={{
                       padding: spacing.scale[2],
                       border: `1px solid ${colors.gray[300]}`,
                       borderRadius: spacing.radius.sm,
                       fontSize: '0.875rem',
                       textAlign: 'right'
                     }}
                     placeholder="OEI"
                   />
                 </>
               )}
             </div>

             <div style={{
               display: 'contents'
             }}>
               <div style={{
                 padding: spacing.scale[2],
                 background: colors.gray[50],
                 borderRadius: spacing.radius.md,
                 display: 'flex',
                 alignItems: 'center',
                 fontWeight: 600,
                 color: colors.aviation.navy,
                 fontSize: '0.875rem'
               }}>
                 Taxi In (kg)
               </div>
               <input
                 type="number"
                 value={fuelBreakdown.taxiIn}
                 onChange={(e) => handleInputChange('taxiIn', e.target.value)}
                 style={{
                   padding: spacing.scale[2],
                   border: `1px solid ${colors.gray[300]}`,
                   borderRadius: spacing.radius.sm,
                   fontSize: '0.875rem',
                   textAlign: 'right'
                 }}
                 placeholder="Enter"
               />
               {showAbnormalOps && (
                 <>
                   <input
                     type="number"
                     value={abnormalOperations.depressurised.taxiIn}
                     onChange={(e) => handleAbnormalInputChange('depressurised', 'taxiIn', e.target.value)}
                     style={{
                       padding: spacing.scale[2],
                       border: `1px solid ${colors.gray[300]}`,
                       borderRadius: spacing.radius.sm,
                       fontSize: '0.875rem',
                       textAlign: 'right'
                     }}
                     placeholder="DP"
                   />
                   <input
                     type="number"
                     value={abnormalOperations.oneEngineInoperative.taxiIn}
                     onChange={(e) => handleAbnormalInputChange('oneEngineInoperative', 'taxiIn', e.target.value)}
                     style={{
                       padding: spacing.scale[2],
                       border: `1px solid ${colors.gray[300]}`,
                       borderRadius: spacing.radius.sm,
                       fontSize: '0.875rem',
                       textAlign: 'right'
                     }}
                     placeholder="OEI"
                   />
                 </>
               )}
             </div>
          </div>

                     <div style={{
             marginTop: spacing.scale[4],
             padding: spacing.scale[3],
             background: colors.withOpacity(colors.aviation.primary, 0.1),
             borderRadius: spacing.radius.md,
             border: `1px solid ${colors.withOpacity(colors.aviation.primary, 0.2)}`
           }}>
                           <div style={{
                display: 'grid',
                gridTemplateColumns: showAbnormalOps ? '1fr 150px 150px 150px' : '1fr 150px',
                gap: spacing.scale[3],
                alignItems: 'center'
              }}>
               <span style={{ fontSize: '1rem', fontWeight: 600, color: colors.aviation.primary }}>
                 Total Fuel Required:
               </span>
               <span style={{ fontSize: '1.25rem', fontWeight: 700, color: colors.aviation.primary, textAlign: 'right' }}>
                 {totalFuelRequired.toLocaleString()} kg
               </span>
               {showAbnormalOps && (
                 <>
                   <span style={{ fontSize: '1.25rem', fontWeight: 700, color: colors.aviation.secondary, textAlign: 'right' }}>
                     {getTotalFuelForOperation(abnormalOperations.depressurised).toLocaleString()} kg
                   </span>
                   <span style={{ fontSize: '1.25rem', fontWeight: 700, color: colors.aviation.navy, textAlign: 'right' }}>
                     {getTotalFuelForOperation(abnormalOperations.oneEngineInoperative).toLocaleString()} kg
                   </span>
                 </>
               )}
             </div>
                           {showAbnormalOps && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 150px 150px 150px',
                  gap: spacing.scale[3],
                  marginTop: spacing.scale[2],
                  fontSize: '0.75rem',
                  color: colors.aviation.muted,
                  textAlign: 'center'
                }}>
                  <span></span>
                  <span>Normal</span>
                  <span>Depressurised</span>
                  <span>One Engine Inop</span>
                </div>
              )}
           </div>
        </CardContent>

        <div style={{
          padding: spacing.scale[4],
          borderTop: `1px solid ${colors.gray[200]}`,
          display: 'flex',
          gap: spacing.scale[2],
          justifyContent: 'flex-end'
        }}>
          <SecondaryButton onClick={onClose}>
            Close
          </SecondaryButton>
        </div>
      </Card>
    </div>
  );
};

export default FuelPolicyModal;
