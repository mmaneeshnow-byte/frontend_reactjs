import React from 'react';
import './App.css';

const roles = {
  frontend: {
    id: 'frontend',
    name: 'Frontend',
    rate: 900
  },

  backend: {
    id: 'backend',
    name: 'Backend',
    rate: 1000
  },

  tester: {
    id: 'tester',
    name: 'QA Testing',
    rate: 600
  },

  cybersecurity: {
    id: 'cybersecurity',
    name: 'Penetration Testing',
    rate: 2000
  }
};

class App extends React.Component {
  createEmptyTask = () => {
    return {
      id: crypto.randomUUID(),
      name: '',
      roleId: 'frontend',
      hours: ''
    };
  };

  constructor() {
    super();

    this.state = {
      tasks: [this.createEmptyTask()]
    };
  }

  addTask = () => {
    this.setState((prevState) => ({
      tasks: [
        ...prevState.tasks,
        this.createEmptyTask()
      ]
    }));
  };

  handleTaskChange = (taskId, field, value) => {
    this.setState((prevState) => ({
      tasks: prevState.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              [field]: value
            }
          : task
      )
    }));
  };

  deleteTask = (taskId) => {
    this.setState((prevState) => ({
      tasks: prevState.tasks.filter(
        (task) => task.id !== taskId
      )
    }));
  };

  getTaskCost = (task) => {
    const role = roles[task.roleId];

    if (!role) {
      return 0;
    }

    return (Number(task.hours) || 0) * role.rate;
  };

  getTotalRate = () => {
    return this.state.tasks.reduce(
      (total, task) => {
        const role = roles[task.roleId];

        return total + (role ? role.rate : 0);
      },
      0
    );
  };

  getTotalHours = () => {
    return this.state.tasks.reduce(
      (total, task) =>
        total + (Number(task.hours) || 0),
      0
    );
  };

  getTotalCost = () => {
    return this.state.tasks.reduce(
      (total, task) =>
        total + this.getTaskCost(task),
      0
    );
  };

  render() {
    const { tasks } = this.state;

    return (
      <div className="app">

        <h1>Estimation Table</h1>

        <button onClick={this.addTask}>
          Add Task
        </button>

        <RoleRates roles={roles} />

        {tasks.length === 0 ? (
          <p>No tasks</p>
        ) : (
          <TaskTable
            tasks={tasks}
            roles={roles}
            onTaskChange={this.handleTaskChange}
            onDelete={this.deleteTask}
            getTaskCost={this.getTaskCost}
          />
        )}

        <Summary
          totalTasks={tasks.length}
          totalHours={this.getTotalHours()}
          totalRate={this.getTotalRate()}
          totalCost={this.getTotalCost()}
        />

      </div>
    );
  }
}

class RoleRates extends React.Component {
  render() {
    const { roles } = this.props;

    return (
      <div className="rate-list">

        {Object.values(roles).map((role) => (
          <div
            key={role.id}
            className="rate-item"
          >
            <span className="rate-name">
              {role.name}
            </span>

            <span className="rate-value">
              {formatCurrency(role.rate)}
              <span className="unit">
                /hr
              </span>
            </span>
          </div>
        ))}

      </div>
    );
  }
}

class TaskTable extends React.Component {
  render() {
    const {
      tasks,
      roles,
      onTaskChange,
      onDelete,
      getTaskCost
    } = this.props;

    return (
      <table>

        <thead>
          <tr>
            <th>Task Name</th>
            <th>Role</th>
            <th>Rate</th>
            <th>Hours</th>
            <th>Cost</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>

          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              roles={roles}
              onTaskChange={onTaskChange}
              onDelete={onDelete}
              getTaskCost={getTaskCost}
            />
          ))}

        </tbody>

      </table>
    );
  }
}

class TaskRow extends React.Component {
  render() {
    const {
      task,
      roles,
      onTaskChange,
      onDelete,
      getTaskCost
    } = this.props;

    const role = roles[task.roleId];

    return (
      <tr>

        <td>
          <input
            type="text"
            value={task.name}
            placeholder="Enter task name"
            onChange={(e) =>
              onTaskChange(
                task.id,
                'name',
                e.target.value
              )
            }
          />
        </td>

        <td>
          <select
            value={task.roleId}
            onChange={(e) =>
              onTaskChange(
                task.id,
                'roleId',
                e.target.value
              )
            }
          >
            {Object.values(roles).map((role) => (
              <option
                key={role.id}
                value={role.id}
              >
                {role.name}
              </option>
            ))}
          </select>
        </td>

        <td className="rate-cell">
          {formatCurrency(role.rate)}
          <span className="unit">
            /hr
          </span>
        </td>

        <td>
          <input
            type="number"
            min="0"
            value={task.hours}
            placeholder="0"
            onChange={(e) =>
              onTaskChange(
                task.id,
                'hours',
                e.target.value
              )
            }
          />
        </td>

        <td className="cost-cell">
          {formatCurrency(
            getTaskCost(task)
          )}
        </td>

        <td>
          <button
            onClick={() =>
              onDelete(task.id)
            }
          >
            Delete
          </button>
        </td>

      </tr>
    );
  }
}

class Summary extends React.Component {
  render() {
    const {
      totalTasks,
      totalHours,
      totalRate,
      totalCost
    } = this.props;

    return (
      <div className="summary">

        <p>
          <strong>Total Tasks:</strong>{' '}
          {totalTasks}
        </p>

        <p>
          <strong>Total Hours:</strong>{' '}
          {totalHours}
        </p>

        <p>
          <strong>Hourly Rate:</strong>{' '}
          {formatCurrency(totalRate)}
        </p>

        <p>
          <strong>Total Cost:</strong>{' '}
          {formatCurrency(totalCost)}
        </p>

      </div>
    );
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export default App;

