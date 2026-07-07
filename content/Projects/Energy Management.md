How do we understand, measure, store, and manage a sites energy usage?

### Fundamentals of Electricity

#### Charge, and Electricity

At the heart of all electrical phenomena is **Electric Charge** (used interchangeably with "charge" for this article). Matter is composed of atoms consisting of protons (positive charge) and electrons (negative charge).

**Electricity**, broadly, is the set of physical phenomena associated with the presence and motion of electric charge.

- **Static Electricity:** When charges build up on an object without moving.
- **Current Electricity:** When charged particles (usually electrons) are free to move through a material.

#### Voltage, Current, and Resistance

We track three fundamental variables. The relationship between them is often visualized using the water analogy.

**Voltage ($V$):** Measured in Volts ($V$). It is the potential difference between two points. Voltage provides the "push" that motivates electrons to move. Without voltage, there is no flow.
- Analogy: Think of this as water pressure. 

**Current ($I$):** Measured in Amperes or Amps ($A$).  It is the measure of how much charge passes a specific point in a specific amount of time.
- Analogy: Think of this as the flow rate of the water.

**Resistance ($R$):** Measured in Ohms ($\Omega$). It is a material's tendency to resist the flow of charge. Conductors (like copper) have low resistance; insulators (like rubber) have high resistance.
- Analogy: Think of this as the size of the pipe or a blockage. 

**Ohm’s Law** explains how these three variables are related:
$$
V = I \times R
$$

#### Energy Transfer vs Electron Transfer

We must elaborate on the difference between the transfer of energy, and the transfer of electrons. 

- **Transfer of Electrons:** Electrons actually move very slowly through a wire, often only a few millimeters per second. They bounce off atoms and face resistance.
- **Transfer of Energy:** When a switch is flipped, the electric field propagates through the circuit at nearly the speed of light. This field pushes all electrons in the loop almost simultaneously.

Analogy: Imagine a bicycle chain. When you pedal, the back wheel moves instantly. You did not have to wait for the specific chain link at the pedal to travel all the way to the back gear. The energy was transferred instantly through the tension of the chain, even though the links (electrons) moved slowly.

#### Electrical Circuits

An **Electrical Circuit** is a closed loop that allows charge to flow continuously. For a circuit to function, it requires three fundamental components:

1. **The Source:** A device that provides the voltage (energy) to push the electrons (e.g., a battery or generator).
2. **The Load:** A device that consumes the energy and converts it into work, heat, or light (e.g., a motor, heater, or LED).
3. **The Conductors:** The path, usually copper wires, that connects the source to the load with minimal resistance.

We distinguish between Direct Current (DC) and Alternating Current (AC).
- **Direct Current (DC):** The electric charge flows in one direction only. This provides a constant voltage and is commonly found in batteries, solar panels, and electronics (like laptops).
- **Alternating Current (AC):** The electric charge changes direction periodically. The voltage reverses polarity, pushing and pulling electrons back and forth. This is the standard for grid electricity because it is efficient to transport over long distances.

The process of converting Alternating Current to Direct Current is called **Rectification**, performed by a device called a **Rectifier**. It uses diodes to redirect the "back and forth" pulses of AC so they all flow in a single direction.

The process of converting Direct Current to Alternating Current is called **Inversion**, performed by an **Inverter**. The inverter uses high-speed electronic switches to rapidly flip the direction of the DC flow, "mimicking" the oscillating wave of AC.

TODO: explain transformers, and e

#### Electrical Power 

**Electrical Power** is the rate of transfer of electrical energy within a circuit. It is measured in Watts ($W$).

**Measuring Power:** In a standard DC system (and resistive AC systems), we measure power by multiplying the voltage across a device by the current flowing through it.
$$
P = V \times I
$$
TODO: elaborate on measuring power in AC.

By convention positive power is generally used to represent devices consuming energy, and negative power is used to represent devices producing energy.

#### Electrical Energy

**Electrical Energy** is the total amount of power consumed over a specific duration. It is generally measured in **Watt-hours (Wh)** or **kilo Watt-hours (kWh)**. While Power is a rate (like speed, km/h), Energy is the total quantity (like distance, km).
$$
E = \int_{t_1}^{t_2} P(t) \, dt
$$

TODO: explain why measuring energy is difficult

### Storing Data

#### Measuring Energy

We cannot measure Energy directly because "Energy" is an abstract total. A sensor can only detect the current state of the wire (Voltage and Amperage) at a specific nanosecond. Therefore, "measuring energy" is actually a computational process, not a sensing one. Smart meters sample the instantaneous voltage and current thousands of times per second (e.g., 2–10 kHz), calculate the Power for that split second, and add that tiny increment to a running total in memory. This process is effectively a digital integration (Riemann sum) performed by the hardware.

#### Three ways of representing time

- **Point in time (Instantaneous):** A value related to a specific point in time (e.g., Grid Frequency or Voltage at 12:00:01).
- **Interval from start (Cumulative):** A total accumulated value since the device turned on. This is the raw "Meter Reading."
- **Interval from previous (Delta):** The amount consumed between two measurements, equivalent to the delta between cumulative values ($Reading_{end} - Reading_{start}$).

#### Compression

At the hardware level, a meter calculates energy thousands of times a second. However, storing or transmitting data at that frequency is technically impossible and financially wasteful. We "compress" this data by discarding the micro-history and only storing the **Cumulative State** at fixed intervals (e.g., every 15 minutes).

Storing a reading every 15 minutes results in 96 data points per day. Storing every second would result in 86,400 points. The 15-minute interval is the industry standard trade-off between granularity and storage cost. It preserves the _total_ volume of energy exactly (because the counter never resets), but it sacrifices the knowledge of exactly _when_ within that 15 minutes a spike occurred.
#### Interpolation

Because of compression, if we need to know the energy state at a time _between_ our stored timestamps (e.g., we have readings at 12:00 and 12:15, but need the value at 12:07), we must estimate it. There are many ways to do this, we consider the following two:

- **Linear Interpolation (Recommended for Cumulative):** We draw a straight line between the two known points.
	- _Physical Implication:_ This assumes the Power (the rate of change) was constant during the interval. This is the most robust method for billing and battery simulation as it preserves the average power.
- **Forward/Backward Fill (Step Function):** We assume the value at 12:00 remains valid until 12:15.
	- _Physical Implication:_ This assumes zero power consumption from \[start, end), followed by an infinite power at the end of the interval. This is not very realistic, but generally more computationally efficient to compute.
#### The Double Odometer 

When tracking energy, we never store a single "Net" value. Instead, we use the "Double Odometer" approach, maintaining two separate, strictly increasing registers: **Cumulative Import** and **Cumulative Export**.

- If instantaneous Power is positive ($P > 0$), we increment the **Import** register. The Export register pauses.
- If instantaneous Power is negative ($P < 0$), we increment the **Export** register. The Import register pauses.

Most smart meters provide these two registers natively.

Two examples where this distinction is relevant include:
- Financial accuracy: Importing 1 kWh usually costs significantly more than the revenue earned from exporting 1 kWh. If we simply summed them to 0 (Net), we would calculate a cost of $0, missing the actual cost incurred by the price spread. 
- Activity: Suppose you have two sites, one exporting and importing 0 kWh, and another exporting and importing 1000 kWh. Both have a net of zero, but physically site B is putting much more strain on the fuses and transformers. This is also relevant for battery cycle calculations.

### Modeling a Site

#### The Simplified Model

We can model almost any site using these standard abstract component types:

- Grid connection (PCC - Point of Common Coupling): The connection to the outside world.
- Load, may be divided in to two subgroups:
	- Controllable Load: Consumption you can actively manage (EV Chargers, HVAC, Heat Pumps)
	- Base Load: Consumption you cannot easily change (lights, IT, fridge)
- Generation: Local production (Photovoltaics (PV) or wind)
- Storage: Energy buffers (BESS - Battery Energy Storage System)

#### Graph Representation

We model a location as the power flow between any of these components.  

To mathematically analyze a location, we represent the site as a Graph, where components are Nodes and the power flowing between them are Edges.

(TODO: explain the representation as a graph where each components corresponds to a node, and the flow of energy between components correspond to edges)

(TODO: explain how in this model every component is connected to every other component, explain how we can talk about the net power of a component as the sum of power flow across edges (explain the proper sign convention in this case, such that kirchoffs holds), explain that and then explain how some edges are largely one-directional, but exceptions exist, explain whether the direction of flow across edges for a single node may always be the same sign or may be different)

At any single instant, the physics of the site is governed by Kirchhoff's Current Law, which dictates that the sum of all power entering and leaving the electrical node must be zero. Energy cannot simply disappear; it must go somewhere.
$$
P_{grid} + P_{generation} + P_{storage} + P_{load} = 0
$$
